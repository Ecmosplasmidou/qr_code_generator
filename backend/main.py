import uuid
import os
import io
import base64
import json
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno

app = Flask(__name__)
# Autorise le frontend (Vite par défaut sur 5173 ou ton URL de prod)
CORS(app)

# URL de base pour les QR Codes (sera remplacée par ton URL Render en prod)
BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
DB_FILE = "database.json"

def load_db():
    try:
        if os.path.exists(DB_FILE):
            with open(DB_FILE, "r", encoding='utf-8') as f:
                content = f.read()
                return json.loads(content) if content else {}
        return {}
    except Exception as e:
        print(f"Erreur lecture DB: {e}")
        return {}

def save_db(data):
    try:
        with open(DB_FILE, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Erreur écriture DB: {e}")

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        data = request.json
        original_url = data.get('url')
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        short_id = str(uuid.uuid4())[:8]
        redirect_url = f"{BASE_URL}/r/{short_id}"
        
        # Génération QR en mémoire
        qr = segno.make(redirect_url)
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        qr_image_base64 = f"data:image/png;base64,{img_str}"
        
        db = load_db()
        new_entry = {
            'id': short_id,
            'originalUrl': original_url,
            'qrImageUrl': qr_image_base64,
            'scanCount': 0
        }
        db[short_id] = new_entry
        save_db(db)
        
        return jsonify(new_entry), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    db = load_db()
    return jsonify(list(db.values())), 200

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    db = load_db()
    if short_id in db:
        db[short_id]['scanCount'] += 1
        save_db(db)
        return redirect(db[short_id]['originalUrl'])
    return "Lien non trouvé", 404

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_qr(short_id):
    try:
        db = load_db()
        if short_id in db:
            del db[short_id]
            save_db(db)
            return jsonify({"message": "Supprimé"}), 200
        return jsonify({"error": "Non trouvé"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)