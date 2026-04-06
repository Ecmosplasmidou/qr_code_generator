import uuid
import os
import io
import base64
import json
import requests # Ajoute 'requests' dans ton requirements.txt
from datetime import datetime
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno

app = Flask(__name__)
CORS(app)

DB_FILE = "database.json"

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r", encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_db(data):
    with open(DB_FILE, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

@app.route('/generate', methods=['POST'])
def generate_qr():
    try:
        data = request.json
        original_url = data.get('url')
        short_id = str(uuid.uuid4())[:8]
        # URL Hardcodée comme tu l'as fait
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        
        qr = segno.make(redirect_url)
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        
        db = load_db()
        db[short_id] = {
            'id': short_id,
            'originalUrl': original_url,
            'qrImageUrl': f"data:image/png;base64,{img_str}",
            'scanCount': 0,
            'last_scan': None # On stockera ici les infos du tout dernier scan
        }
        save_db(db)
        return jsonify(db[short_id]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    db = load_db()
    if short_id in db:
        # 1. Détection de l'appareil
        ua = request.headers.get('User-Agent', '')
        device = "PC/Autre"
        if "iPhone" in ua: device = "iPhone"
        elif "Android" in ua: device = "Android"
        
        # 2. Détection de la Ville via l'IP
        city = "Inconnue"
        try:
            # On récupère l'IP (Render transmet l'IP réelle via X-Forwarded-For)
            ip = request.headers.get('X-Forwarded-For', request.remote_addr).split(',')[0]
            geo = requests.get(f"http://ip-api.com/json/{ip}", timeout=2).json()
            if geo.get('status') == 'success':
                city = geo.get('city', 'Inconnue')
        except:
            pass

        # 3. Mise à jour des stats
        db[short_id]['scanCount'] += 1
        db[short_id]['last_scan'] = {
            "date": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "device": device,
            "city": city
        }
        
        save_db(db)
        return redirect(db[short_id]['originalUrl'])
    return "Lien non trouvé", 404

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    db = load_db()
    return jsonify(list(db.values())), 200

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_qr(short_id):
    db = load_db()
    if short_id in db:
        del db[short_id]
        save_db(db)
        return jsonify({"status": "ok"}), 200
    return jsonify({"error": "not found"}), 404

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)