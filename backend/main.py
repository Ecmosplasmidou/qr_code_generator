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

# 1. CHARGEMENT DES VARIABLES D'ENVIRONNEMENT
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. CONFIGURATION MONGODB
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    print("❌ ERREUR : La variable MONGO_URI est introuvable.")
    client = None
    qrcodes_collection = None
else:
    try:
        client = MongoClient(MONGO_URI)
        db = client['qr_database']
        qrcodes_collection = db['qrcodes']
        print("✅ Connexion à MongoDB Atlas réussie !")
    except Exception as e:
        print(f"❌ Erreur de connexion MongoDB : {e}")
        client = None

# 3. ROUTES DE L'API

@app.route('/generate', methods=['POST'])
def generate_qr():
    if qrcodes_collection is None:
        return jsonify({"error": "Base de données non connectée"}), 500
        
    try:
        data = request.json
        original_url = data.get('url')
        
        # Récupération des options de style (couleurs)
        # Valeurs par défaut : Noir sur Blanc
        dark_color = data.get('color', '#000000')
        light_color = data.get('bg_color', '#FFFFFF')
        
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        # Génération d'un ID court unique
        short_id = str(uuid.uuid4())[:8]
        
        # URL de redirection (Celle de ton serveur Render)
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        
        # Création du QR Code avec Segno
        # 'error=h' permet une meilleure lecture même avec des couleurs claires
        qr = segno.make(redirect_url, error='h')
        out = io.BytesIO()
        
        # Sauvegarde avec les couleurs personnalisées
        qr.save(out, kind='png', scale=10, dark=dark_color, light=light_color)
        
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        
        # Structure du document pour MongoDB
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
        
        # Suppression de l'ID interne MongoDB pour la réponse
        new_document.pop('_id', None)
        return jsonify(new_document), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    if qrcodes_collection is None:
        return "Erreur de base de données", 500

    qr_item = qrcodes_collection.find_one({"id": short_id})
    
    if qr_item:
        # Collecte des données de scan
        ua = request.headers.get('User-Agent', '')
        device = "iPhone" if "iPhone" in ua else "Android" if "Android" in ua else "PC/Autre"
        
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
        
        # Mise à jour dans MongoDB (Incrémentation + Historique)
        qrcodes_collection.update_one(
            {"id": short_id},
            {
                "$inc": {"scanCount": 1},
                "$push": {"scans_history": new_scan}
            }
        )
        
        return redirect(qr_item['originalUrl'])
        
    return "Lien QR Code non trouvé", 404

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    if qrcodes_collection is None:
        return jsonify([]), 500
    all_qr = list(qrcodes_collection.find({}, {'_id': 0}))
    return jsonify(all_qr), 200

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_qr(short_id):
    if qrcodes_collection is None:
        return jsonify({"error": "Base de données non connectée"}), 500
        
    result = qrcodes_collection.delete_one({"id": short_id})
    if result.deleted_count > 0:
        return jsonify({"status": "ok"}), 200
    return jsonify({"error": "Non trouvé"}), 404

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

# --- STATS GLOBALES POUR ANALYTICS ---
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
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)