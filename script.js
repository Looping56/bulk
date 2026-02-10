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
