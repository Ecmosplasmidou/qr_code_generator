import uuid
import os
import io
import base64
import json
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno

app = Flask(__name__)
CORS(app)

DB_FILE = "database.json"

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            return json.load(f)
    return {}

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        data = request.json
        original_url = data.get('url')
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        short_id = str(uuid.uuid4())[:8]
        redirect_url = f"http://localhost:5000/r/{short_id}"
        
        qr = segno.make(redirect_url)
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        qr_image_base64 = f"data:image/png;base64,{img_str}"
        
        db = load_db()
        db[short_id] = {
            'id': short_id,
            'originalUrl': original_url,
            'qrImageUrl': qr_image_base64, # On stocke l'image pour la recharger plus tard
            'scanCount': 0
        }
        save_db(db)
        
        return jsonify(db[short_id]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# NOUVELLE ROUTE : Récupérer tous les QR codes pour l'historique
@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    db = load_db()
    # On transforme le dictionnaire en liste pour React
    return jsonify(list(db.values())), 200

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    db = load_db()
    if short_id in db:
        db[short_id]['scanCount'] += 1
        save_db(db)
        return redirect(db[short_id]['originalUrl'])
    return "Lien non trouvé", 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)