function doGet() {
  return HtmlService.createTemplateFromFile('Index')
      .evaluate()
      .setTitle('Aplikasi Katalog Produk')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getSheetNames() {
  var spreadsheetId = '1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs'; // ID spreadsheet Anda
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheets = ss.getSheets();
  var sheetNames = [];
  
  for (var i = 0; i < sheets.length; i++) {
    sheetNames.push(sheets[i].getName());
  }
  
  return sheetNames;
}

function getSheetHeaders(sheetName) {
  var spreadsheetId = '1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs'; // ID spreadsheet Anda
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return [];
  }
  
  var lastColumn = sheet.getLastColumn();
  if (lastColumn === 0) {
      return [];
  }
  
  // Ambil data dari baris pertama (header)
  var headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  
  // Filter header yang kosong
  var filteredHeaders = headers.filter(function(header) {
    return header.toString().trim() !== "";
  });
  
  return filteredHeaders;
}

function getSheetData(sheetName) {
  var spreadsheetId = '1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs'; // ID spreadsheet Anda
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    return { headers: [], data: [] };
  }
  
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  
  if (lastRow <= 1 || lastColumn === 0) {
      return { headers: [], data: [] };
  }
  
  // Get raw headers
  var rawHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var validHeaderIndices = [];
  var filteredHeaders = [];
  
  // Find indices of non-empty headers
  for (var i = 0; i < rawHeaders.length; i++) {
    if (rawHeaders[i].toString().trim() !== "") {
      validHeaderIndices.push(i);
      filteredHeaders.push(rawHeaders[i]);
    }
  }
  
  // Get data rows
  var rawData = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  var formattedData = [];
  
  for (var r = 0; r < rawData.length; r++) {
    var isRowEmpty = true;
    var rowObj = {};
    
    for (var h = 0; h < validHeaderIndices.length; h++) {
      var colIndex = validHeaderIndices[h];
      var cellValue = rawData[r][colIndex];
      rowObj[filteredHeaders[h]] = cellValue;
      
      // Jika ada satu sel saja yang terisi, maka baris ini tidak kosong
      if (cellValue !== "" && cellValue !== null) {
          isRowEmpty = false;
      }
    }
    
    // Hanya dorong data ke aplikasi jika baris memiliki isi (mengabaikan baris kosong di bawah tabel)
    if (!isRowEmpty) {
        formattedData.push(rowObj);
    }
  }
  
  return { headers: filteredHeaders, data: formattedData };
}