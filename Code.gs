const SPREADSHEET_ID = '1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs';

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Data Viewer')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function getSheetData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ['FAN', 'ELECTRICAL', 'LIGHTING', 'STOCK'];
    let allData = [];
    
    sheets.forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (sheet) {
        // PENTING: Menggunakan getDisplayValues() untuk menghindari error 
        // saat Apps Script gagal membaca format Tanggal (Date).
        // Ini adalah penyebab utama data tidak muncul sebelumnya.
        const data = sheet.getDataRange().getDisplayValues(); 
        
        if (data.length > 0) {
          const headers = data[0];
          
          for (let i = 1; i < data.length; i++) {
            const rowObj = {};
            rowObj['Tab Asal'] = sheetName; 
            
            headers.forEach((h, idx) => {
              if (h) {
                rowObj[h] = data[i][idx];
              }
            });
            
            // Masukkan jika baris tidak kosong semua
            if (data[i].join('').trim() !== '') {
              allData.push(rowObj);
            }
          }
        }
      }
    });
    
    return { status: 'success', data: allData };
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}
