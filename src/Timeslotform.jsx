import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Accordion = ({ day, children, isOpen, onClick, onCheckAll }) => {
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleCheckAll = (e) => {
    e.stopPropagation();
    onCheckAll(e.target.checked);
  };

  return (
    <div className={`m-1 duration-200 ease-out bg-white border rounded-md cursor-pointer group ${isOpen ? "border-neutral-200/60" : "border-transparent"}`}>
      <button
        onClick={handleToggle}
        className={`flex items-center justify-between w-full px-5 py-4 font-semibold text-left select-none ${isOpen ? "text-neutral-800" : "text-neutral-600 hover:text-neutral-800"}`}
      >
        <span className="flex items-center">
          <input type="checkbox" onChange={handleCheckAll} onClick={(e) => e.stopPropagation()} className="mr-2" />
          {day}
        </span>
        <div className={`relative flex items-center justify-center w-2.5 h-2.5 duration-300 ease-out ${isOpen ? "rotate-90" : ""}`}>
          <div className="absolute w-0.5 h-full bg-current rounded-full"></div>
          <div className={`absolute w-full h-0.5 ease duration-500 bg-current rounded-full ${isOpen ? "rotate-90" : ""}`}></div>
        </div>
      </button>
      {isOpen && <div className="p-5 pt-0">{children}</div>}
    </div>
  );
};

Accordion.propTypes = {
  day: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onCheckAll: PropTypes.func.isRequired,
};

const TimeSlotForm = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [isLoading_sub, setIsLoading_sub] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDays, setOpenDays] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [weekCount, setWeekCount] = useState(0);
  const url = "https://script.google.com/macros/s/AKfycbyXCbJUFlkhsaeADDGPE1u21g4oPgBxD5TtUbawo0QArpNQUwCbJZYLmCXWK27eyRVL/exec";

  const weekDays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
  const timeSlots = ["9:00", "10:40", "13:00", "14:40", "16:40", "18:20", "20:00"];

  useEffect(() => {
    // スプレッドシートから日付を取得
    const fetchDates = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setStartDate(dayjs.tz(data.startDate, "Asia/Tokyo").format("YYYY-MM-DD"));
        setEndDate(dayjs.tz(data.endDate, "Asia/Tokyo").format("YYYY-MM-DD"));
        setIsLoading(true);
      } catch (error) {
        console.error("日付の取得に失敗しました:", error);
      }
    };
    console.log(`開始日：${startDate}`);
    console.log(`終了日：${endDate}`);

    fetchDates();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      const diffWeeks = end.diff(start, "week") + 1;
      setWeekCount(diffWeeks);
    }
  }, [startDate, endDate]);

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleDayCheck = (day, isChecked) => {
    timeSlots.forEach((_, index) => {
      setValue(`${day}_timeslot_${index}`, isChecked);
    });
  };

  const onSubmit = (data) => {
    setIsLoading_sub(true);
    console.log("送信データ:", data);

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log("レスポンス:", response);
        setIsLoading_sub(false);
        if (response.type === "opaque") {
          alert("予定が送信されました。実際の結果はスプレッドシートを確認してください。");
        } else {
          alert("予期せぬレスポンスタイプです。スプレッドシートを確認してください。");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        setIsLoading_sub(false);
        alert("エラーが発生しました。");
      });
  };

  if (!isLoading) {
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center ">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-full flex-col items-center relative p-4">
      <div className="w-full max-w-md mx-auto text-xs">
        <div className="mb-6 text-center text-4xl font-medium">週間予定表</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {Array.from({ length: weekCount }, (_, weekIndex) => {
            const weekStart = dayjs(startDate).add(weekIndex, "week");
            return (
              <div key={weekIndex} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{weekStart.format("YYYY/MM/DD")} の週</h3>
                {weekDays.map((day, dayIndex) => {
                  // ここを修正：日付の計算を調整
                  const date = weekStart.add(dayIndex, "day");
                  const fullDay = `${date.format("YYYY/MM/DD")}_${day}`;
                  return (
                    <Accordion
                      key={fullDay}
                      day={`${date.format("M/D")} (${weekDays[date.day()]})`}
                      isOpen={!!openDays[fullDay]}
                      onClick={() => toggleDay(fullDay)}
                      onCheckAll={(isChecked) => handleDayCheck(fullDay, isChecked)}
                    >
                      {timeSlots.map((time, timeIndex) => (
                        <div key={`${fullDay}_${time}`} className="flex items-center mb-2">
                          <input type="checkbox" {...register(`${fullDay}_timeslot_${timeIndex}`)} className="mr-2" />
                          <span>{time}</span>
                        </div>
                      ))}
                    </Accordion>
                  );
                })}
              </div>
            );
          })}
          <div className="block mt-4">
            <button type="submit" className="bg-[#9117f5] rounded-lg text-white p-2 w-full" disabled={isLoading_sub}>
              送信！
            </button>
          </div>
        </form>
      </div>
      {isLoading_sub && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <span className="loading loading-dots loading-lg"></span>
            <p className="text-xl font-semibold text-gray-700">予定を送信中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotForm;
