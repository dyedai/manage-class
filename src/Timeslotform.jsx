import { useState } from "react";
import { useForm } from "react-hook-form";

const TimeSlotForm = () => {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    const timeSlots = ["timeslot_0", "timeslot_1", "timeslot_2", "timeslot_3", "timeslot_4", "timeslot_5", "timeslot_6"];

    const result = timeSlots.map((slot) => (data[slot] ? 1 : 0));

    console.log("Sending data:", { timeSlots: result });

    const url = "https://script.google.com/macros/s/AKfycbyBrWTFGLleXZWqHxAveoO3UZ3FH9bqU_mloaYJy6ORINm57deswrNqap_OyfibsnVz/exec";

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timeSlots: result }),
    })
      .then((response) => {
        console.log("レスポンス:", response);
        setIsLoading(false);
        if (response.type === "opaque") {
          alert("予定が送信されました。実際の結果はスプレッドシートを確認してください。");
        } else {
          alert("予期せぬレスポンスタイプです。スプレッドシートを確認してください。");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        setIsLoading(false);
        alert("エラーが発生しました。");
      });
  };

  return (
    <div className="flex h-screen flex-col items-center relative">
      <div className="mt-16 w-full md:mt-0 md:w-2/5">
        <div className="m-6 text-center text-4xl font-medium">スプシに書き込み</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>9:00</div>
            <input type="checkbox" {...register("timeslot_0")} />
          </div>
          <div>
            <div>10:40</div>
            <input type="checkbox" {...register("timeslot_1")} />
          </div>
          <div>
            <div>13:00</div>
            <input type="checkbox" {...register("timeslot_2")} />
          </div>
          <div>
            <div>14:40</div>
            <input type="checkbox" {...register("timeslot_3")} />
          </div>
          <div>
            <div>16:40</div>
            <input type="checkbox" {...register("timeslot_4")} />
          </div>
          <div>
            <div>18:20</div>
            <input type="checkbox" {...register("timeslot_5")} />
          </div>
          <div>
            <div>20:00</div>
            <input type="checkbox" {...register("timeslot_6")} />
          </div>
          <div className="block">
            <button type="submit" className="bg-[#9117f5] rounded-lg text-white p-2 mt-4" disabled={isLoading}>
              送信！
            </button>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <div className=" animate-spin rounded-full h-16 w-16 border-4 border-dotted border-[#9117f5] mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">ローディング中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotForm;
