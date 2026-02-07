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