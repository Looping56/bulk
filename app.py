from flask import Flask, render_template, request, jsonify, send_file
import sqlite3
import csv
import os

app = Flask(__name__)
DB_PATH = 'lego.db'

# --- LOGIQUE FINANCIÈRE ---
FRAIS_POURCENTAGE = 0.07

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- ROUTES UTILISATEURS ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_catalogue')
def get_catalogue():
    """Récupère les 4 fixes et les pièces validées pour le choix final"""
    conn = get_db()
    items = conn.execute("SELECT * FROM catalogue_final").fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in items])

@app.route('/valider_commande', methods=['POST'])
def valider_commande():
    """Calcule le total avec 7% et enregistre en base"""
    data = request.json
    nom = data['membre']
    panier = data['panier'] # Liste d'objets {ref, qte, prix_u}
    
    sous_total = sum(item['qte'] * item['prix_u'] for item in panier)
    frais = sous_total * FRAIS_POURCENTAGE
    total_final = sous_total + frais
    
    conn = get_db()
    # Enregistrement de la commande
    cur = conn.cursor()
    cur.execute("INSERT INTO commandes (membre, sous_total, frais, total_final) VALUES (?,?,?,?)",
                (nom, sous_total, frais, total_final))
    commande_id = cur.lastrowid
    
    # Enregistrement du détail pour le Bon de Commande
    for item in panier:
        cur.execute("INSERT INTO details_commande (commande_id, reference, qte) VALUES (?,?,?)",
                    (commande_id, item['ref'], item['qte']))
    
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "total": total_final, "frais": frais})

# --- ROUTES ADMIN ---

@app.route('/admin/import_csv', methods=['POST'])
def import_csv():
    """Importe le fichier catalogue.csv pour mettre à jour les prix"""
    if 'file' not in request.files: return "Pas de fichier", 400
    file = request.files['file']
    
    stream = file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(stream)
    
    conn = get_db()
    conn.execute("DELETE FROM catalogue_final") # Reset du catalogue
    for row in reader:
        conn.execute("INSERT INTO catalogue_final (reference, nom_piece, prix_unitaire, type_piece) VALUES (?,?,?,?)",
                     (row['ref'], row['nom'], float(row['prix']), row['type']))
    conn.commit()
    conn.close()
    return "Catalogue mis à jour !"

@app.route('/admin/dashboard')
def dashboard():
    """Récupère toutes les commandes pour le tableau de bord"""
    conn = get_db()
    commandes = conn.execute("SELECT * FROM commandes ORDER BY date_commande DESC").fetchall()
    conn.close()
    return jsonify([dict(c) for c in commandes])

if __name__ == '__main__':
    app.run(debug=True)
