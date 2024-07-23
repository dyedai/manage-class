function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("先生予定表");

  const startDate = sheet.getRange("A2").getValue();
  const endDate = sheet.getRange("B2").getValue();

  // 日付をYYYY-MM-DD形式の文字列に変換
  const formatDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const response = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };

  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const weekOrder = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const timeSlots = ["9:00", "10:40", "13:00", "14:40", "16:40", "18:20", "20:00"];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("先生予定表");

  // 送信されたデータから日付を抽出し、ソート
  const dates = Object.keys(data)
    .filter((key) => key.includes("_"))
    .map((key) => key.split("_")[0])
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  // 二次元配列を作成
  const values = [];
  dates.forEach((date) => {
    weekOrder.forEach((day, dayIndex) => {
      const fullDay = `${date}_${day}`;
      timeSlots.forEach((_, timeIndex) => {
        const key = `${fullDay}_timeslot_${timeIndex}`;
        values.push([data[key] === true ? "1" : ""]);
      });
    });
  });

  // 範囲を指定してデータを書き込み
  const range = sheet.getRange(3, 8, values.length, 1);
  range.setValues(values);

  return ContentService.createTextOutput(JSON.stringify({ message: "success!" })).setMimeType(ContentService.MimeType.JSON);
}
