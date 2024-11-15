import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Schedule from "./pages/Schedule";
import Calendar from "./pages/Calendar";
import Requests from "./pages/Requests";
import Groups from "./pages/Groups";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="flex flex-col-reverse lg:flex-row bg-primary h-dvh ">
        <Sidebar />
        <div className="bg-white rounded-[20px] flex-1 p-9 m-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/requests" element={<Requests />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
