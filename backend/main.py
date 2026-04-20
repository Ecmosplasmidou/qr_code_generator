import uuid, os, hashlib, jwt, bcrypt, stripe
from datetime import datetime
from functools import wraps
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

SECRET_KEY = os.environ.get("SECRET_KEY")
MONGO_URI = os.environ.get("MONGO_URI")
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET")

client = MongoClient(MONGO_URI)
db = client['qr_database']
qrcodes_collection = db['qrcodes']
users_collection = db['users']

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'message': 'Token manquant'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_collection.find_one({"email": data['email']})
            if not current_user:
                return jsonify({'message': 'Utilisateur introuvable'}), 401
        except:
            return jsonify({'message': 'Token invalide'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email, password = data.get('email'), data.get('password')
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "Email déjà utilisé"}), 400
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({
        "email": email, 
        "password": hashed_password, 
        "is_pro": False, 
        "created_at": datetime.now()
    })
    return jsonify({"message": "Compte créé"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users_collection.find_one({"email": data.get('email')})
    if user and bcrypt.checkpw(data.get('password').encode('utf-8'), user['password']):
        token = jwt.encode({
            'email': user['email'], 
            'exp': datetime.now().timestamp() + 86400
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({
            "token": token, 
            "email": user['email'], 
            "is_pro": user.get('is_pro', False)
        }), 200
    return jsonify({"message": "Identifiants incorrects"}), 401

@app.route('/create-checkout-session', methods=['POST'])
@token_required
def create_checkout(current_user):
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {'name': 'QRLYZE PRO - Accès Illimité'},
                    'unit_amount': 200, 
                    'recurring': {'interval': 'month'},
                },
                'quantity': 1,
            }],
            mode='subscription',
            customer_email=current_user['email'],
            success_url="http://localhost:5173/app?payment=success",
            cancel_url="http://localhost:5173/upgrade",
        )
        return jsonify({'url': session.url})
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except Exception as e:
        return jsonify(message="Invalid Webhook Signature"), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Accès direct aux attributs de l'objet Stripe
        try:
            customer_email = session.customer_details.email
        except AttributeError:
            customer_email = None
        
        if customer_email:
            users_collection.update_one(
                {"email": customer_email},
                {"$set": {"is_pro": True}}
            )
            
    return "Success", 200

@app.route('/generate', methods=['POST'])
@token_required
def generate_entry(current_user):
    if not current_user.get('is_pro', False):
        return jsonify({"error": "Abonnement PRO requis"}), 403
        
    data = request.json
    gen_type = data.get('type', 'qr')
    short_id = str(uuid.uuid4())[:8]
    original_url = data.get('url')
    content = original_url
    
    if gen_type == 'vcard' and data.get('vcard'):
        v = data.get('vcard')
        content = f"BEGIN:VCARD\nVERSION:3.0\nFN:{v.get('name')}\nTEL:{v.get('phone')}\nEMAIL:{v.get('email')}\nEND:VCARD"

    new_doc = {
        'id': short_id, 
        'owner': current_user['email'], 
        'type': gen_type,
        'title': data.get('vcard', {}).get('name') if gen_type == 'vcard' else original_url,
        'originalUrl': original_url, 
        'encoded_text': content,
        'color': data.get('color', '#000000'), 
        'bg_color': data.get('bg_color', '#FFFFFF'),
        'design': data.get('design', 'extra-rounded'), 
        'eye_design': data.get('eye_design', 'square'),
        'logo': data.get('logo'), 
        'logo_size': data.get('logo_size', 0.4),
        'scanCount': 0, 
        'scans_history': [], 
        'created_at': datetime.now().isoformat()
    }
    qrcodes_collection.insert_one(new_doc)
    new_doc.pop('_id')
    return jsonify(new_doc), 200

@app.route('/all-qrcodes', methods=['GET'])
@token_required
def get_all(current_user):
    user_qrs = list(qrcodes_collection.find({"owner": current_user['email']}, {'_id': 0}))
    return jsonify(user_qrs), 200

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    qr = qrcodes_collection.find_one({"id": short_id})
    if qr:
        ua = request.headers.get('User-Agent', '')
        device = "iPhone" if "iPhone" in ua else "Android" if "Android" in ua else "PC"
        qrcodes_collection.update_one(
            {"id": short_id}, 
            {"$inc": {"scanCount": 1}, "$push": {"scans_history": {"date": datetime.now().strftime("%d/%m/%Y %H:%M"), "device": device}}}
        )
        return redirect(qr['originalUrl'])
    return "Not Found", 404

@app.route('/delete/<short_id>', methods=['DELETE'])
@token_required
def delete_entry(current_user, short_id):
    qrcodes_collection.delete_one({"id": short_id, "owner": current_user['email']})
    return jsonify({"status": "ok"}), 200

@app.route('/update-title/<short_id>', methods=['PATCH'])
@token_required
def update_title(current_user, short_id):
    qrcodes_collection.update_one(
        {"id": short_id, "owner": current_user['email']}, 
        {"$set": {"title": request.json.get('title')}}
    )
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)