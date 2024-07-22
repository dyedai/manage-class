import { useForm } from "react-hook-form";

const TimeSlotForm = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
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
        if (response.type === "opaque") {
          alert("予定が送信されました。実際の結果はスプレッドシートを確認してください。");
        } else {
          alert("予期せぬレスポンスタイプです。スプレッドシートを確認してください。");
        }
      })
      .catch((error) => {
        console.error("エラー:", error);
        alert("エラーが発生しました。");
      });
  };
  return (
    <div className="flex h-screen flex-col items-center">
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
            <button type="submit" className="bg-[#9117f5] rounded-lg text-white">
              送信！
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimeSlotForm;
