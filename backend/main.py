import uuid
import os
import io
import base64
import json
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
import segno

app = Flask(__name__)

# Configuration CORS large pour éviter les blocages en développement
CORS(app, resources={r"/*": {"origins": "*"}})

# URL de base (sera écrasée par la variable d'environnement sur Render)
BASE_URL = os.environ.get("BASE_URL", "http://localhost:5000")
DB_FILE = "database.json"

def load_db():
    """Charge les données depuis le fichier JSON local."""
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
    """Sauvegarde les données dans le fichier JSON local."""
    try:
        with open(DB_FILE, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"Erreur écriture DB: {e}")

@app.route('/generate', methods=['POST'])
def generate_qr():
    """Génère un nouveau QR Code et l'enregistre."""
    try:
        data = request.json
        original_url = data.get('url')
        if not original_url:
            return jsonify({"error": "URL manquante"}), 400

        short_id = str(uuid.uuid4())[:8]
        redirect_url = f"{BASE_URL}/r/{short_id}"
        
        # Génération de l'image QR en mémoire
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
        
        print(f"Génération réussie : {short_id}")
        return jsonify(new_entry), 200
    except Exception as e:
        print(f"Erreur generation: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    """Récupère tous les QR Codes de la base de données."""
    try:
        db = load_db()
        return jsonify(list(db.values())), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    """Route de redirection qui incrémente les scans."""
    db = load_db()
    if short_id in db:
        db[short_id]['scanCount'] += 1
        save_db(db)
        return redirect(db[short_id]['originalUrl'])
    return "Lien non trouvé", 404

@app.route('/delete/<short_id>', methods=['DELETE', 'OPTIONS'])
def delete_qr(short_id):
    """Supprime un QR Code de la base de données."""
    # Gestion manuelle du Preflight CORS pour la méthode DELETE
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
        
    try:
        db = load_db()
        if short_id in db:
            del db[short_id]
            save_db(db)
            print(f"Suppression réussie : {short_id}")
            return jsonify({"message": "Supprimé avec succès"}), 200
        else:
            return jsonify({"error": "QR Code non trouvé"}), 404
    except Exception as e:
        print(f"Erreur lors de la suppression: {e}")
        return jsonify({"error": str(e)}), 500

# Cette ligne doit impérativement rester à la fin
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    # host='0.0.0.0' est nécessaire pour le déploiement sur Render
    app.run(host='0.0.0.0', port=port, debug=True)