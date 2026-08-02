function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ELITE FAN A446')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
}

// Fungsi ini dipanggil dari index.html untuk mengambil data
function getSpreadsheetData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Pastikan nama sheet di bawah ini SAMA PERSIS (huruf besar/kecilnya) dengan di Google Sheet Anda
  const sheetNames = ["FAN", "Electrical", "LIGHTING"];
  const result = {};

  sheetNames.forEach(sheetName => {
    const sheet = ss.getSheetByName(sheetName);
    
    if (sheet) {
      // getDisplayValues() menjaga format text/angka/tanggal persis seperti yang terlihat di Excel/Sheet
      const data = sheet.getDataRange().getDisplayValues(); 
      
      if (data.length > 1) { // Pastikan ada baris header dan minimal 1 baris data
        const headers = data[0];
        const rows = [];
        
        // Looping data mulai dari baris ke-2 (index 1)
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          const obj = {};
          
          // Mapping array ke object JSON sesuai header kolom
          for (let j = 0; j < headers.length; j++) {
            if (headers[j] && headers[j].toString().trim() !== "") {
               obj[headers[j]] = row[j];
            }
          }
          rows.push(obj);
        }
        result[sheetName] = rows;
      } else {
         result[sheetName] = []; // Sheet ada tapi tidak ada datanya
      }
    } else {
        result[sheetName] = []; // Jika Sheet tidak ditemukan (salah ketik nama sheet)
    }
  });

  return result; // Mengirim data kembali ke HTML
}