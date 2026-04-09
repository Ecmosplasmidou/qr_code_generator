import uuid, os, io, base64, hashlib
from datetime import datetime
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# CONFIGURATION MONGODB
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI) if MONGO_URI else None
db = client['qr_database'] if client else None
qrcodes_collection = db['qrcodes'] if db is not None else None

def generate_row_color(short_id):
    hue = int(hashlib.md5(short_id.encode()).hexdigest(), 16) % 360
    return f"hsl({hue}, 80%, 97%)"


@app.route('/generate', methods=['POST'])
def generate_entry():
    try:
        data = request.json
        gen_type = data.get('type', 'qr') # 'qr', 'link', ou 'vcard'
        original_url = data.get('url')
        
        # Données vCard (si le type est vcard)
        vcard_data = data.get('vcard', {}) 
        
        # Si c'est une vCard, on construit la chaîne vCard
        content_to_encode = original_url
        if gen_type == 'vcard':
            content_to_encode = (
                f"BEGIN:VCARD\nVERSION:3.0\n"
                f"FN:{vcard_data.get('name', 'Contact')}\n"
                f"TEL:{vcard_data.get('phone', '')}\n"
                f"EMAIL:{vcard_data.get('email', '')}\n"
                f"URL:{vcard_data.get('website', '')}\n"
                f"END:VCARD"
            )

        short_id = str(uuid.uuid4())[:8]
        
        new_doc = {
            'id': short_id,
            'type': gen_type,
            'title': vcard_data.get('name') if gen_type == 'vcard' else original_url,
            'originalUrl': original_url,
            'vcard_details': vcard_data, # On sauvegarde les détails pour l'édition
            'encoded_text': content_to_encode, # Ce qui sera réellement dans le QR
            'color': data.get('color', '#000000'),
            'bg_color': data.get('bg_color', '#FFFFFF'),
            'design': data.get('design', 'extra-rounded'),
            'eye_design': data.get('eye_design', 'square'),
            'logo_size': data.get('logo_size', 0.4),
            'scanCount': 0,
            'scans_history': [],
            'rowColor': generate_row_color(short_id)
        }
        qrcodes_collection.insert_one(new_doc)
        new_doc.pop('_id', None)
        return jsonify(new_doc), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    """Route cruciale : compte la visite et redirige"""
    qr_item = qrcodes_collection.find_one({"id": short_id})
    if qr_item:
        ua = request.headers.get('User-Agent', '')
        device = "iPhone" if "iPhone" in ua else "Android" if "Android" in ua else "PC"
        
        new_scan = {
            "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "device": device,
            "city": "Inconnue"
        }
        
        qrcodes_collection.update_one(
            {"id": short_id},
            {"$inc": {"scanCount": 1}, "$push": {"scans_history": new_scan}}
        )
        return redirect(qr_item['originalUrl'])
    return "Lien non trouvé", 404

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    return jsonify(list(qrcodes_collection.find({}, {'_id': 0}))), 200

@app.route('/update-style/<short_id>', methods=['PATCH'])
def update_style(short_id):
    data = request.json
    qrcodes_collection.update_one(
        {"id": short_id},
        {"$set": {
            "color": data.get('color'),
            "bg_color": data.get('bg_color'),
            "design": data.get('design'),
            "eye_design": data.get('eye_design')
        }}
    )
    return jsonify({"status": "ok"}), 200

@app.route('/update-title/<short_id>', methods=['PATCH'])
def update_title(short_id):
    qrcodes_collection.update_one({"id": short_id}, {"$set": {"title": request.json.get('title')}})
    return jsonify({"status": "ok"}), 200

@app.route('/update-url/<short_id>', methods=['PATCH'])
def update_url(short_id):
    qrcodes_collection.update_one({"id": short_id}, {"$set": {"originalUrl": request.json.get('url')}})
    return jsonify({"status": "ok"}), 200

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_entry(short_id):
    qrcodes_collection.delete_one({"id": short_id})
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))