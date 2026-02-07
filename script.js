function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var data = JSON.parse(e.postData.contents); // On reçoit les 11 pièces
  
  var sessionId = new Date().getTime(); // ID unique basé sur l'heure
  var date = new Date();
  var annee = date.getFullYear();

  // On boucle pour ajouter les 11 lignes d'un coup
  data.pieces.forEach(function(p) {
    sheet.appendRow([date, sessionId, p.ref, p.color, annee]);
  });
  
  return ContentService.createTextOutput("Succès").setMimeType(ContentService.MimeType.TEXT);
}
// --- FONCTION ADMIN AVEC MOT DE PASSE ---
function accesAdmin() {
    const mdp = prompt("Entrez le mot de passe administrateur :");
    if (mdp === "LEGO2026") { // Vous pourrez changer le mot de passe ici
        showSection('admin-panel');
    } else {
        alert("Accès refusé.");
    }
}

// --- GÉNÉRATION DU BON DE COMMANDE ---
function genererBonCommande(membre, choixFinal) {
    // Création d'un visuel simple à imprimer ou sauver en PDF
    console.log("Génération du bon pour : " + membre);
    // Cette fonction exportera les données en format texte ou PDF
}
function genererBon() {
    const nom = document.getElementById('member-name').value;
    if (!nom) {
        alert("Veuillez entrer votre nom avant de générer le bon !");
        return;
    }

    // On récupère les données des 11 pièces
    let lignesTableau = "";
    for (let i = 1; i <= 11; i++) {
        const ref = document.getElementById(`ref-${i}`).value || "---";
        const col = document.getElementById(`col-${i}`).value;
        const imgUrl = `https://img.bricklink.com/ItemImage/PN/11/${ref}.png`;
        
        lignesTableau += `
            <tr>
                <td>${i}</td>
                <td><img src="${imgUrl}" style="width:40px;" onerror="this.src='https://placehold.co/40x40?text=Lego'"></td>
                <td><strong>${ref}</strong></td>
                <td>${col}</td>
                <td>[ ]</td>
            </tr>`;
    }

    // On ouvre une nouvelle fenêtre pour l'impression
    const fenetreImpression = window.open('', '', 'height=800,width=600');
    fenetreImpression.document.write(`
        <html>
            <head>
                <title>Bon de Commande - ${nom}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; }
                    .header { text-align: center; border-bottom: 3px solid #d1121b; padding-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: center; }
                    th { background-color: #f2f2f2; }
                    .footer { margin-top: 50px; display: flex; justify-content: space-between; }
                    .sign-box { border: 1px solid #000; width: 200px; height: 100px; padding: 10px; font-size: 0.8em; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>BON DE COMMANDE LEGO 2026</h1>
                    <p>Membre : <strong>${nom.toUpperCase()}</strong> | Date : ${new Date().toLocaleDateString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Aperçu</th>
                            <th>Référence</th>
                            <th>Couleur</th>
                            <th>Reçu</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lignesTableau}
                    </tbody>
                </table>
                <div class="footer">
                    <div class="sign-box">Signature Membre :</div>
                    <div class="sign-box">Validation Admin :</div>
                </div>
                <br>
                <button class="no-print" onclick="window.print()" style="padding:10px 20px; background:#237841; color:white; border:none; cursor:pointer;">Imprimer le Bon</button>
            </body>
        </html>
    `);
    fenetreImpression.document.close();
}

