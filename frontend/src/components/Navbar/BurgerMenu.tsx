"use client";
import React, { useState } from "react";

interface BurgerProps {
  onClick: () => void;
  open: boolean;
}

const BurgerMenu = ({ onClick, open }: BurgerProps) => {
  return (
    <div
      onClick={onClick}
      id="sidebar-toggle"
      className={`${
        open ? "active" : ""
      } toggle  relative md:hidden cursor-pointer flex flex-col sm:w-6 sm:h-5 w-8 z-20 h-5 justify-between`}
    >
      <span
        className={` bg-primary transition-transform origin-top-right rounded-sm w-full h-1 block`}
      ></span>
      <span
        className={` bg-primary rounded-sm transition-transform  w-full h-1 block`}
      ></span>
      <span
        className={` bg-primary transition-transform origin-bottom-right rounded-sm w-full h-1 block`}
      ></span>
    </div>
  );
};

export default BurgerMenu;
