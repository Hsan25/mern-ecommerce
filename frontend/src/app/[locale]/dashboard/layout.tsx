import NavbarDashboard from "@/components/Dashboard/Navbar";
import SideBarDashboard from "@/components/Dashboard/SideBar";
import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: "Dashboard",
  },
  description: "Dashboard",
};
const LayoutDashboard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex absolute inset-0 overflow-hidden max-h-screen min-h-screen">
        <SideBarDashboard />
        <div className="w-full overflow-auto">
          <NavbarDashboard />
          <div className="p-5 overflow-auto min-h-[90vh]">{children}</div>
        </div>
      </div>
    </>
  );
};

export default LayoutDashboard;
