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
# Lit le fichier .env en local. Sur Render, il utilisera les variables de l'onglet Environment.
load_dotenv()

app = Flask(__name__)
CORS(app)

# 2. CONFIGURATION MONGODB
MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    print("❌ ERREUR : La variable MONGO_URI est introuvable.")
    # On ne bloque pas l'exécution pour permettre à Flask de démarrer, 
    # mais les routes MongoDB échoueront.
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
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        # Génération d'un ID court unique
        short_id = str(uuid.uuid4())[:8]
        
        # URL de redirection (Celle de ton serveur Render)
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        
        # Création du QR Code
        qr = segno.make(redirect_url)
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10)
        img_str = base64.b64encode(out.getvalue()).decode('utf-8')
        
        # Structure du document pour MongoDB
        new_document = {
            'id': short_id,
            'originalUrl': original_url,
            'qrImageUrl': f"data:image/png;base64,{img_str}",
            'scanCount': 0,
            'scans_history': [] # Liste vide qui accueillera tous les futurs scans
        }
        
        # Sauvegarde dans MongoDB
        qrcodes_collection.insert_one(new_document)
        
        # Nettoyage de l'objet pour la réponse JSON (on retire l'ID interne de MongoDB)
        new_document.pop('_id', None)
        return jsonify(new_document), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    if qrcodes_collection is None:
        return "Erreur de base de données", 500

    # Recherche du QR code dans la base
    qr_item = qrcodes_collection.find_one({"id": short_id})
    
    if qr_item:
        # --- COLLECTE DES DONNÉES DE SCAN ---
        
        # 1. Appareil
        ua = request.headers.get('User-Agent', '')
        if "iPhone" in ua:
            device = "iPhone"
        elif "Android" in ua:
            device = "Android"
        else:
            device = "PC/Autre"
        
        # 2. Ville via IP (ip-api)
        city = "Inconnue"
        try:
            # Récupération de l'IP réelle (Render utilise X-Forwarded-For)
            ip_header = request.headers.get('X-Forwarded-For', request.remote_addr)
            ip = ip_header.split(',')[0].strip()
            
            geo_res = requests.get(f"http://ip-api.com/json/{ip}", timeout=2).json()
            if geo_res.get('status') == 'success':
                city = geo_res.get('city', 'Inconnue')
        except:
            pass # En cas d'erreur API geo, on garde "Inconnue"

        # 3. Création de l'entrée d'historique
        new_scan = {
            "date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            "device": device,
            "city": city
        }
        
        # --- MISE À JOUR DANS MONGODB ---
        qrcodes_collection.update_one(
            {"id": short_id},
            {
                "$inc": {"scanCount": 1},        # On ajoute +1 au compteur
                "$push": {"scans_history": new_scan} # On ajoute le scan à la liste
            }
        )
        
        # Redirection finale vers le lien original
        return redirect(qr_item['originalUrl'])
        
    return "Lien QR Code non trouvé", 404

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    if qrcodes_collection is None:
        return jsonify([]), 500
        
    # On récupère tout, on exclut l'ID technique '_id' de MongoDB
    all_qr = list(qrcodes_collection.find({}, {'_id': 0}))
    return jsonify(all_qr), 200

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_qr(short_id):
    if qrcodes_collection is None:
        return jsonify({"error": "Base de données non connectée"}), 500
        
    result = qrcodes_collection.delete_one({"id": short_id})
    
    if result.deleted_count > 0:
        return jsonify({"status": "ok"}), 200
    return jsonify({"error": "QR Code non trouvé"}), 404

if __name__ == '__main__':
    # On utilise le port fourni par Render ou 5000 par défaut
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)