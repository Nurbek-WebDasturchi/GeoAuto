import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export const AppLayout = () => (
  <div className="min-h-screen bg-white pb-20 md:pb-0">
    <Navbar />
    <Outlet />
  </div>
);
