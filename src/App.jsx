import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Attendance from '@/pages/Attendance';
import Schedule from '@/pages/Schedule';
import Calendar from '@/pages/Calendar';
import Requests from '@/pages/Requests';
import Ministries from '@/pages/Ministries';
import Home from '@/pages/Home';
import MainLayout from '@/layouts/main-layout';
import Announcements from './pages/Announcements';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Home />} />
        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/requests" element={<Requests />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
