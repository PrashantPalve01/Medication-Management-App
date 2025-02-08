import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Chart = lazy(() => import("../pages/Chart"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Reminders = lazy(() => import("../pages/Reminders"));
const Medication = lazy(() => import("../pages/MedicationList"));
const EditProfile = lazy(() => import("../pages/EditProfilePages"));

const coreRoutes = [
  {
    path: "/dashboard",
    title: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/calendar",
    title: "Calendar",
    component: Calendar,
  },
  {
    path: "/profile",
    title: "Profile",
    component: Profile,
  },
  {
    path: "/settings",
    title: "Settings",
    component: Settings,
  },
  {
    path: "/chart",
    title: "Chart",
    component: Chart,
  },
  {
    path: "/reminders",
    title: "Reminders",
    component: Reminders,
  },
  {
    path: "/medication",
    title: "Medication",
    component: Medication,
  },
  {
    path: "/edit-profile",
    title: "Edit Profile",
    component: EditProfile,
  },
];

const routes = [...coreRoutes];
export default routes;
