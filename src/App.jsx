import { Route, Routes, BrowserRouter } from "react-router-dom";

import TimeSlotForm from "./Timeslotform";
import Testsp from "./Testasp";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TimeSlotForm />} />
          <Route path="test" element={<Testsp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
