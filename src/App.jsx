import { Route, Routes, BrowserRouter } from "react-router-dom";

import TimeSlotForm from "./Timeslotform";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TimeSlotForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
