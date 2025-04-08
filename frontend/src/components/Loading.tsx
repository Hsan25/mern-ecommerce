import React from "react";
import { Md123 } from "react-icons/md";

interface PropsLoading {
  size?: "sm" | "md" | "xl";
}

const sizes = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
  xl: "w-14 h-14",
};

const positions = {
  center: "justify-center items-center",
  end: "justify-end items-center",
  start: "justify-start items-center",
};

interface LoadingProps {
  size?: "xl" | "md" | "sm";
  position?: "start" | "center" | "end";
}
const Loading = ({ size = "xl", position = "center" }: LoadingProps) => {
  return (
    <div className={`w-full flex ${positions[position]}`}>
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-white border-b-transparent`}
      ></div>
    </div>
  );
};

export default Loading;
