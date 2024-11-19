import DashboardIcon from "@/assets/icons/dashboard-icon.svg";
import AttendanceIcon from "@/assets/icons/attendance-icon.svg";
import GroupsIcon from "@/assets/icons/groups-icon.svg";
import ScheduleIcon from "@/assets/icons/schedule-icon.svg";
// import CalendarIcon from "@/assets/icons/calendar-icon.svg"; For version 2
import RequestIcon from "@/assets/icons/request-icon.svg";
import DashboardIconSelected from "@/assets/icons/dashboard-icon-selected.svg";
import AttendanceIconSelected from "@/assets/icons/attendance-icon-selected.svg";
import GroupsIconSelected from "@/assets/icons/groups-icon-selected.svg";
import ScheduleIconSelected from "@/assets/icons/schedule-icon-selected.svg";
import RequestIconSelected from "@/assets/icons/request-icon-selected.svg";
// import CalendarIconSelected from "@/assets/icons/calendar-icon-selected.svg"; For version 2
import AnnouncementsIcon from "@/assets/icons/announcements-icon.svg";

import AnnouncementsIconSelected from "@/assets/icons/announcements-icon-selected.svg";

export const sidebarLinks = Object.freeze([
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: DashboardIcon,
    selectedIcon: DashboardIconSelected,
  },
  {
    label: "Announcements",
    link: "/announcements",
    icon: AnnouncementsIcon,
    selectedIcon: AnnouncementsIconSelected,
  },
  {
    label: "Attendance",
    link: "/attendance",
    icon: AttendanceIcon,
    selectedIcon: AttendanceIconSelected,
  },
  {
    label: "Ministries",
    link: "/ministries",
    icon: GroupsIcon,
    selectedIcon: GroupsIconSelected,
  },
  {
    label: "Schedule",
    link: "/schedule",
    icon: ScheduleIcon,
    selectedIcon: ScheduleIconSelected,
  },
  // {
  //   label: "Calendar",
  //   link: "/calendar",
  //   icon: CalendarIcon,
  //   selectedIcon: CalendarIconSelected,
  // }, for Version 2
  {
    label: "Requests",
    link: "/requests",
    icon: RequestIcon,
    selectedIcon: RequestIconSelected,
  },
]);
