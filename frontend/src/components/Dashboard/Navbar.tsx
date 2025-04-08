"use client";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import React from "react";

const NavbarDashboard = () => {
  const { user } = useAuth();
  return (
    <nav className="w-full bg-slate-700 h-16 relative p-2 px-4">
      <div className="flex gap-3 items-center absolute right-0 mr-4">
        <div className="font-semibold">
          {user?.username}
        </div>
        <div className="relative w-12 h-12 overflow-hidden rounded-full border-white">
          <Image src={user?.avatar.url || ""} alt="avatar" fill />
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
