import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorConsult from "./DoctorConsult";
import DoctorDetails from "./DoctorDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DoctorConsult />} />
        <Route path="/doctor-details" element={<DoctorDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
