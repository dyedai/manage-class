function doPost(e) {
  const name = e.parameter.name || "";
  const body = e.parameter.body || "";

  if (!name || !body) {
    return ContentService.createTextOutput(JSON.stringify({ message: "validation error!" }));
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("シート2");
  sheet.appendRow([name, body, "受付", new Date()]);

  return ContentService.createTextOutput(JSON.stringify({ message: "success!" }));
}
