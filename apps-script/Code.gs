/**
 * Receptor dos formulários para as duas planilhas.
 * Implantar como Aplicativo da Web, executar como a conta proprietária e copiar
 * a URL /exec para FORM_ENDPOINT em assets/app.js após a revisão de privacidade.
 */
const SPREADSHEETS = {
  career: "1YXRG4_0gVAev6xnQkj6z8CBLmSa5xLUPP3oIaylQkwU",
  insurance: "10itYj5Df-juN5mnYr4PqlZpwR8NaJhXhPjfxSqhkdkk"
};
const TAB_NAMES = {career:"Leads - Carreira", insurance:"Leads - Seguro"};
const HEADERS = ["Recebido em","Nome","WhatsApp","E-mail","Cidade / Estado","Interesse","Consentimento de contato","Origem"];
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
