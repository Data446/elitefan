/**
 * ELITE FAN A446 JEMBER - Google Apps Script Backend
 * Spreadsheet ID: 1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs
 */

const SPREADSHEET_ID = '1xPxsScZhffvB84K3sbFJMmZ2XvGCIX_4YHLZ4nqPnTs';

function doGet(e) {
  const htmlOutput = HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('ELITE FAN A446 JEMBER')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return htmlOutput;
}

function getAllSheetsData() {
  try {
    let ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch(err) {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    const sheetNames = ['FAN', 'ELECTRICAL', 'LIGHTING', 'STOCK'];
    const result = {};

    sheetNames.forEach(name => {
      const sheet = ss.getSheetByName(name);
      if (sheet) {
        const rawData = sheet.getDataRange().getValues();
        if (rawData.length > 0) {
          result[name] = parseSheetRows(rawData);
        } else {
          result[name] = [];
        }
      } else {
        result[name] = [];
      }
    });

    return {
      status: 'success',
      data: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.toString()
    };
  }
}

function parseSheetRows(rawData) {
  let headerIndex = -1;
  for (let i = 0; i < Math.min(15, rawData.length); i++) {
    const rowStr = rawData[i].join(' ').toUpperCase();
    if (rowStr.includes('ARTICLE') || rowStr.includes('PRODUCT NAME')) {
      headerIndex = i;
      break;
    }
  }

  if (headerIndex === -1) headerIndex = 0;

  const headers = rawData[headerIndex].map(h => h.toString().trim());
  const rows = [];

  for (let i = headerIndex + 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row.some(cell => cell !== '' && cell !== null && cell !== undefined)) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      if (h) {
        rowObj[h] = row[idx] !== undefined ? row[idx] : '';
      }
    });
    rows.push(rowObj);
  }

  return rows;
}
