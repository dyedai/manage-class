function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("講習会日程");

  let startDate = sheet.getRange("B4").getValue();
  let endDate = sheet.getRange("C4").getValue();

  // 終了日を週の最後の土曜日に調整
  endDate = adjustToLastSaturday(endDate);

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

function adjustToLastSaturday(date) {
  const d = new Date(date);
  const day = d.getDay();
  if (day !== 6) {
    // 土曜日でない場合
    d.setDate(d.getDate() + (6 - day)); // 次の土曜日に調整
  }
  return d;
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const weekOrder = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const timeSlots = ["9:00", "10:40", "13:00", "14:40", "16:40", "18:20", "20:00"];

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("database");

  // 送信されたデータから日付を抽出し、ソート
  const dates = Object.keys(data)
    .filter((key) => key.includes("_"))
    .map((key) => key.split("_")[0])
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => new Date(a) - new Date(b));

  // 二次元配列を作成
  const values = [];
  dates.forEach((date) => {
    const dateObj = new Date(date);
    weekOrder.forEach((day, dayIndex) => {
      if (dateObj.getDay() === dayIndex) {
        const fullDay = `${date}_${day}`;
        timeSlots.forEach((_, timeIndex) => {
          const key = `${fullDay}_timeslot_${timeIndex}`;
          values.push([data[key] === true ? "1" : ""]);
        });
      }
    });
  });

  // デバッグ用のログ出力
  console.log("Processed data:", JSON.stringify(values));

  // 範囲を指定してデータを書き込み
  const range = sheet.getRange(2, 1, values.length, 1);
  range.setValues(values);

  return ContentService.createTextOutput(JSON.stringify({ message: "success!" })).setMimeType(ContentService.MimeType.JSON);
}
