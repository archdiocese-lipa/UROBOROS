import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Schedule from "./pages/Schedule";
import Calendar from "./pages/Calendar";
import Requests from "./pages/Requests";
import Groups from "./pages/Groups";
import Home from "./pages/Home";
import clsx from "clsx";

// Layout component that conditionally renders Sidebar
function Layout({ children }) {
  const url = useLocation();
  const isAuthRoute = url.pathname === "/";

  return (
    <div
      className={clsx("flex bg-primary h-dvh", {
        "flex-col-reverse lg:flex-row": !isAuthRoute,
      })}
    >
      {/* Render Sidebar only if it's not an auth route */}
      {!isAuthRoute && <Sidebar />}
      <div className="bg-white rounded-[20px] flex-1 p-9 m-4">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes*/}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
