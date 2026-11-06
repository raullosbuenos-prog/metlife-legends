/**
 * Receptor dos formulários para as duas planilhas.
 * Implantar como Aplicativo da Web, executar como a conta proprietária e copiar
 * a URL /exec para FORM_ENDPOINT em assets/app.js após a revisão de privacidade.
 */
const SPREADSHEETS = {
  career: "10itYj5Df-juN5mnYr4PqlZpwR8NaJhXhPjfxSqhkdkk",
  insurance: "1YXRG4_0gVAev6xnQkj6z8CBLmSa5xLUPP3oIaylQkwU"
};
const TAB_NAMES = {career:"Leads - Carreira", insurance:"Leads - Seguro"};
const HEADERS = ["Recebido em","Nome","WhatsApp","E-mail","Cidade / Estado","Interesse","Consentimento de contato","Origem"];
const CAPTURE_URLS = {
  career: "https://raullosbuenos-prog.github.io/metlife-legends/carreira/",
  insurance: "https://raullosbuenos-prog.github.io/metlife-legends/seguro/"
};

// Run once after publishing to add the right page link to each workbook.
// This adds a dedicated tab and preserves existing data and tabs.
function setupLinks() {
  const rows = {
    career: [["Página de captura", "URL"], ["Conheça a Equipe Legends", CAPTURE_URLS.career]],
    insurance: [["Página de captura", "URL"], ["Converse sobre proteção", CAPTURE_URLS.insurance]]
  };
  Object.keys(SPREADSHEETS).forEach(function(kind) {
    const book = SpreadsheetApp.openById(SPREADSHEETS[kind]);
    const name = "Links de captura";
    const sheet = book.getSheetByName(name) || book.insertSheet(name);
    sheet.getRange(1, 1, rows[kind].length, 2).setValues(rows[kind]);
    sheet.getRange(2, 2).setFormula('=HYPERLINK("' + CAPTURE_URLS[kind] + '","Abrir página")');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 2);
  });
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    const kind = String(p.form || "");
    if (!SPREADSHEETS[kind] || p.website || String(p.consent || "").toLowerCase() !== "sim") return response_(false);
    const name=clean_(p.name,100), phone=clean_(p.phone,30), email=clean_(p.email,160), city=clean_(p.city,100), interest=clean_(p.interest,150);
    if (!name || !phone || !email || !city || !interest) return response_(false);
    const book=SpreadsheetApp.openById(SPREADSHEETS[kind]);
    const sheet=book.getSheetByName(TAB_NAMES[kind]) || book.insertSheet(TAB_NAMES[kind]);
    if (sheet.getLastRow()===0) { sheet.appendRow(HEADERS); sheet.setFrozenRows(1); }
    sheet.appendRow([new Date(),cell_(name),cell_(phone),cell_(email),cell_(city),cell_(interest),"Sim",cell_(clean_(p.source || "landing",80))]);
    return response_(true);
  } catch (err) { return response_(false); }
}
function clean_(value,limit) { return String(value || "").replace(/[\u0000-\u001f]/g,"").trim().slice(0,limit); }
function cell_(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function response_(ok) {
  const payload=JSON.stringify({type:"legends-lead",ok:Boolean(ok)});
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>parent.postMessage('+payload+',"*");</script>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
