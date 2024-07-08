import "./App.css";
import { useForm } from "react-hook-form";
import axios from "axios";

function App() {
  const { register, handleSubmit } = useForm();
  const deployID = "AKfycbw_5mlV0rcvMYJzzwimnKLU04v-7gHroRbiWeGPa14Fp_hoon_hoV5FJj2DjaScJPZe";

  const onSubmit = (data) => {
    axios
      .post(`https://script.google.com/macros/s/${deployID}/exec`, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((res) => {
        console.log("できた？", res.data);
        alert("送信完了");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center">
        <div className="mt-16 w-full md:mt-0 md:w-2/5">
          <div className="m-6 text-center text-4xl font-medium">スプシに書き込み</div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>
              お名前
              <input
                className="border block"
                type="text"
                {...register("name", {
                  required: "名前を入力してください",
                })}
              />
            </label>
            <label>
              問い合わせ
              <textarea
                rows={5}
                className="border block"
                type="text"
                {...register("body", {
                  required: "問い合わせ内容を入力してください",
                })}
              />
            </label>
            <div className="block">
              <button type="submit" className="bg-[#9117f5] rounded-lg text-white">
                送信！
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
