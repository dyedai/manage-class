function doPost(e) {
  const timeslots = e.parameter.timeslots || ""; // 文字列として取得

  if (timeslots.length !== 7) {
    return ContentService.createTextOutput(JSON.stringify({ message: "validation error!" }));
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("先生予定表");

  // H3からH9に書き込み
  for (let i = 0; i < timeslots.length; i++) {
    sheet.getRange(3 + i, 8).setValue(timeslots[i]);
  }

  return ContentService.createTextOutput(JSON.stringify({ message: "success!" }));
}
