import uuid
import os
import io
import base64
import requests
import hashlib
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
        original_url = data.get('url')
        gen_type = data.get('type', 'qr')
        dark_color = data.get('color', '#000000')
        light_color = data.get('bg_color', '#FFFFFF')
        design = data.get('design', 'square')
        frame = data.get('frame', 'none')
        
        if not original_url: return jsonify({"error": "URL manquante"}), 400

        short_id = str(uuid.uuid4())[:8]
        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        
        img_str = ""
        if gen_type == 'qr':
            qr = segno.make(redirect_url, error='h')
            out = io.BytesIO()
            qr.save(out, kind='png', scale=10, dark=dark_color, light=light_color)
            img_str = f"data:image/png;base64,{base64.b64encode(out.getvalue()).decode('utf-8')}"
        
        new_doc = {
            'id': short_id,
            'type': gen_type,
            'title': original_url,
            'originalUrl': original_url,
            'qrImageUrl': img_str,
            'color': dark_color,
            'bg_color': light_color,
            'design': design,
            'frame': frame,
            'scanCount': 0,
            'scans_history': [],
            'rowColor': generate_row_color(short_id)
        }
        qrcodes_collection.insert_one(new_doc)
        new_doc.pop('_id', None)
        return jsonify(new_doc), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/update-style/<short_id>', methods=['PATCH'])
def update_style(short_id):
    try:
        data = request.json
        dark = data.get('color')
        light = data.get('bg_color')
        design = data.get('design')
        frame = data.get('frame')

        redirect_url = f"https://qr-code-generator-python3.onrender.com/r/{short_id}"
        qr = segno.make(redirect_url, error='h')
        out = io.BytesIO()
        qr.save(out, kind='png', scale=10, dark=dark, light=light)
        img_str = f"data:image/png;base64,{base64.b64encode(out.getvalue()).decode('utf-8')}"

        qrcodes_collection.update_one(
            {"id": short_id},
            {"$set": {"color": dark, "bg_color": light, "qrImageUrl": img_str, "design": design, "frame": frame}}
        )
        return jsonify({"status": "ok", "newImageUrl": img_str}), 200
    except Exception as e: return jsonify({"error": str(e)}), 500

@app.route('/r/<short_id>')
def redirect_and_track(short_id):
    qr_item = qrcodes_collection.find_one({"id": short_id})
    if qr_item:
        ua = request.headers.get('User-Agent', '')
        device = "iPhone" if "iPhone" in ua else "Android" if "Android" in ua else "PC"
        new_scan = {"date": datetime.now().strftime("%d/%m/%Y %H:%M:%S"), "device": device, "city": "Inconnue"}
        qrcodes_collection.update_one({"id": short_id}, {"$inc": {"scanCount": 1}, "$push": {"scans_history": new_scan}})
        return redirect(qr_item['originalUrl'])
    return "Non trouvé", 404

@app.route('/all-qrcodes', methods=['GET'])
def get_all():
    return jsonify(list(qrcodes_collection.find({}, {'_id': 0}))), 200

@app.route('/delete/<short_id>', methods=['DELETE'])
def delete_entry(short_id):
    qrcodes_collection.delete_one({"id": short_id})
    return jsonify({"status": "ok"}), 200

@app.route('/update-title/<short_id>', methods=['PATCH'])
def update_title(short_id):
    qrcodes_collection.update_one({"id": short_id}, {"$set": {"title": request.json.get('title')}})
    return jsonify({"status": "ok"}), 200

@app.route('/update-url/<short_id>', methods=['PATCH'])
def update_url(short_id):
    qrcodes_collection.update_one({"id": short_id}, {"$set": {"originalUrl": request.json.get('url')}})
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))