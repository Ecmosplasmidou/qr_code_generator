import uuid
import os
import io
import base64
import requests
from datetime import datetime
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno
from pymongo import MongoClient
from dotenv import load_dotenv

# 1. CONFIGURATION ET VARIABLES D'ENVIRONNEMENT
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. CONNEXION MONGODB ATLAS
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    print("❌ ERREUR : La variable MONGO_URI est introuvable dans le .env ou sur Render.")
    client = None
    qrcodes_collection = None
else:
    try:
        # Connexion au cluster
        client = MongoClient(MONGO_URI)
        db = client['qr_database']
        qrcodes_collection = db['qrcodes']
        print("✅ Connexion à MongoDB Atlas réussie !")
    except Exception as e:
        print(f"❌ Erreur de connexion MongoDB : {e}")
        client = None

# 3. ROUTES DE L'API

# --- GÉNÉRER UN NOUVEAU QR CODE ---
@app.route('/generate', methods=['POST'])
def generate_qr():
    if qrcodes_collection is None:
        return jsonify({"error": "Base de données non connectée"}), 500
        
    try:
        data = request.json
        original_url = data.get('url')
        dark_color = data.get('color', '#000000')  # Couleur du QR
        light_color = data.get('bg_color', '#FFFFFF')  # Couleur du fond
        
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        short_id = str(uuid.uuid4())[:8]
        
        # URL de redirection (Ton serveur Render)
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        
        # Création du QR Code avec Segno (Haute correction d'erreur pour supporter les couleurs)
        qr = segno.make(redirect_url, error='h')
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10, dark=dark_color, light=light_color)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        
        new_document = {
            'id': short_id,
            'title': original_url,
            'originalUrl': original_url,
            'qrImageUrl': f"data:image/png;base64,{img_str}",
            'color': dark_color,
            'bg_color': light_color,
            'scanCount': 0,
            'scans_history': []
        }
        
        qrcodes_collection.insert_one(new_document)
        new_document.pop('_id', None)
        return jsonify(new_document), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- SYSTÈME DE REDIRECTION ET TRACKING ---
@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    if qrcodes_collection is None:
        return "Erreur de base de données", 500

    qr_item = qrcodes_collection.find_one({"id": short_id})
    
    if qr_item:
        # Analyse de l'appareil
        ua = request.headers.get('User-Agent', '')
        device = "iPhone" if "iPhone" in ua else "Android" if "Android" in ua else "PC/Autre"
        
        # Géolocalisation via IP
        city = "Inconnue"
        try:
            ip_header = request.headers.get('X-Forwarded-For', request.remote_addr)
            ip = ip_header.split(',')[0].strip()
            geo_res = requests.get(f"http://ip-api.com/json/{ip}", timeout=2).json()
            if geo_res.get('status') == 'success':
                city = geo_res.get('city', 'Inconnue')
        except:
            pass

        new_scan = {
            "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "device": device,
            "city": city
        }
        
        # Mise à jour MongoDB
        qrcodes_collection.update_one(
            {"id": short_id},
            {
                "$inc": {"scanCount": 1},
                "$push": {"scans_history": new_scan}
            }
        )
        
        return redirect(qr_item['originalUrl'])
        
    return "Lien QR Code non trouvé", 404

# --- RÉCUPÉRER TOUS LES QR CODES ---
@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    if qrcodes_collection is None:
        return jsonify([]), 500
    all_qr = list(qrcodes_collection.find({}, {'_id': 0}))
    return jsonify(all_qr), 200

# --- SUPPRIMER UN QR CODE ---
@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_qr(short_id):
    if qrcodes_collection is None:
        return jsonify({"error": "Base de données non connectée"}), 500
    result = qrcodes_collection.delete_one({"id": short_id})
    if result.deleted_count > 0:
        return jsonify({"status": "ok"}), 200
    return jsonify({"error": "QR Code non trouvé"}), 404

# --- MODIFIER LE TITRE ---
@app.route('/update-title/<short_id>', methods=['PATCH'])
def update_title(short_id):
    try:
        data = request.json
        new_title = data.get('title')
        qrcodes_collection.update_one({"id": short_id}, {"$set": {"title": new_title}})
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- MODIFIER L'URL (QR DYNAMIQUE) ---
@app.route('/update-url/<short_id>', methods=['PATCH'])
def update_url(short_id):
    try:
        data = request.json
        new_url = data.get('url')
        qrcodes_collection.update_one({"id": short_id}, {"$set": {"originalUrl": new_url}})
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- MODIFIER L'APPARENCE (RÉGÉNÉRATION D'IMAGE) ---
@app.route('/update-style/<short_id>', methods=['PATCH'])
def update_style(short_id):
    try:
        data = request.json
        dark_color = data.get('color', '#000000')
        light_color = data.get('bg_color', '#FFFFFF')

        # Régénération de l'image avec les nouvelles couleurs
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        qr = segno.make(redirect_url, error='h')
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10, dark=dark_color, light=light_color)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        new_image_url = f"data:image/png;base64,{img_str}"

        # Mise à jour MongoDB
        qrcodes_collection.update_one(
            {"id": short_id},
            {"$set": {
                "color": dark_color,
                "bg_color": light_color,
                "qrImageUrl": new_image_url
            }}
        )
        return jsonify({"status": "ok", "newImageUrl": new_image_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- STATS GLOBALES ---
@app.route('/global-stats', methods=['GET'])
def get_global_stats():
    if qrcodes_collection is None:
        return jsonify({}), 500
    try:
        all_qr = list(qrcodes_collection.find({}, {'_id': 0}))
        total_scans = sum(qr.get('scanCount', 0) for qr in all_qr)
        total_qrs = len(all_qr)
        return jsonify({
            "total_scans": total_scans,
            "total_qrs": total_qrs
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Utilisation du port Render ou 5000 en local
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)