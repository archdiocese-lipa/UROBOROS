import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Schedule from "@/pages/Schedule";
import Requests from "@/pages/Requests";
import Ministries from "@/pages/Ministries";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/main-layout";
import Announcements from "@/pages/Announcements";
import Family from "@/pages/Family";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import PrivacyPolicy from "@/pages/Privacy-Policy";

import RequireRole from "@/components/RequireRole";

import { ROLES } from "@/constants/roles";
import ResetPassword from "./pages/ResetPassword";
import AcceptInvite from "./pages/AcceptInvite";
import SendFeedback from "./pages/SendFeedback";
import Feedback from "./pages/Feedback";
import FeedBackSuccess from "./pages/FeedBackSuccess";

const App = () => {
  return (
    // <Router basename="/portal">
    <Router>
      <Routes>
        {/* No Auth Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/send-feedback" element={<SendFeedback />} />
        <Route path="/feedback/success" element={<FeedBackSuccess />} />
        {/* Privacy Policy Route */}
        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          {/* ========================================================= */}
          {/* Only Admin and Coordinator can access the routes below */}
          <Route element={<RequireRole roles={[ROLES[0], ROLES[4]]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* ========================================================= */}
          {/*  Admin and Coordinator can access the routes below */}
          <Route element={<RequireRole roles={[...ROLES]} />}>
            <Route path="/ministries" element={<Ministries />} />
          </Route>
          {/* ========================================================= */}
          {/* Only admin can access the routes below */}
          <Route element={<RequireRole roles={[ROLES[4]]} />}>
            <Route path="/requests" element={<Requests />} />
            <Route path="/feedback" element={<Feedback />} />
          </Route>
          {/* ========================================================= */}
          {/* Roles of Coordinator and Volunteer can access the routes below */}
          <Route
            element={<RequireRole roles={[ROLES[0], ROLES[1], ROLES[4]]} />}
          >
            {/* Add Route for OrganizedEvents */}
            <Route path="/schedule" element={<Schedule />} />
          </Route>
          {/* ========================================================= */}
          {/* Roles of Coordinator and Parishioner can access the routes below */}
          <Route element={<RequireRole roles={[...ROLES]} />}>
            {/* Add Route for Events */}
            <Route path="/events" element={<Events />} />
            <Route path="/family" element={<Family />} />
            {/* Add Route for Family */}
          </Route>
          {/* ========================================================= */}
          {/* All Roles Can Access Routes Below */}
          <Route element={<RequireRole roles={[...ROLES]} />}>
            <Route path="/announcements" element={<Announcements />} />

            <Route path="/profile" element={<Profile />} />

            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          {/* ========================================================= */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
