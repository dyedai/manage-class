import { Route, Routes, BrowserRouter } from "react-router-dom";
import Test2 from "./test2";
import TimeSlotForm from "./test1";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TimeSlotForm />} />
          <Route path="test" element={<Test2 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
