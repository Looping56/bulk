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
function genererBon() {
    const nom = document.getElementById('member-name').value;
    if (!nom) {
        alert("Veuillez entrer votre nom avant de générer le bon !");
        return;
    }

    let contenu = `======================================\n`;
    contenu += `   BON DE COMMANDE LEGO - 2026\n`;
    contenu += `======================================\n\n`;
    contenu += `MEMBRE : ${nom.toUpperCase()}\n`;
    contenu += `DATE   : ${new Date().toLocaleDateString()}\n\n`;
    contenu += `LISTE DES 11 PIÈCES SÉLECTIONNÉES :\n`;
    contenu += `--------------------------------------\n`;

    for (let i = 1; i <= 11; i++) {
        const ref = document.getElementById(`ref-${i}`).value || "Non spécifiée";
        const col = document.getElementById(`col-${i}`).value;
        contenu += `${i}. Réf: ${ref} | Couleur: ${col}\n`;
    }

    contenu += `\n--------------------------------------\n`;
    contenu += `Signature Membre : \n\n\n`;
    contenu += `Signature Admin  : \n`;
    contenu += `======================================\n`;

    // Création du lien de téléchargement
    const blob = new Blob([contenu], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bon_Commande_Lego_${nom}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

