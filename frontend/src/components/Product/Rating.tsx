import React from "react";
import { FaStar } from "react-icons/fa6";

const Rating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 items-center">
      <FaStar className="fill-primary" size={16} />
      <div className="text-xs mt-0.5">{rating}</div>
    </div>
  );
};

export default Rating;
