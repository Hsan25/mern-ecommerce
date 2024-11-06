"use client";
import React, { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { FaHome, FaUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { MdPayments, MdLocalShipping } from "react-icons/md";
import { IoDocumentText } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
interface Bar {
  name: string;
  href: string;
  icon: ReactNode;
}
const bar: Bar[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <FaHome size={20} />,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: <FaUser size={20} />,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: <AiFillProduct size={20} />,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <IoDocumentText size={20} />,
  },
  {
    name: "Payment",
    href: "/dashboard/payment",
    icon: <MdPayments size={20} />,
  },
  {
    name: "Shipping Method",
    href: "/dashboard/shipping-method",
    icon: <MdLocalShipping size={20} />,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: <IoDocumentText size={20} />,
  },
];

const SideBarDashboard = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const path = usePathname();
  const { push } = useRouter();
  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        id="sidebar-toggle"
        className={`${
          isOpen ? "active" : ""
        } toggle sm:hidden  absolute m-4 mt-5 cursor-pointer flex flex-col w-8 z-20 h-5 justify-between`}
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
      <div
        className={`${
          isOpen ? "-left-0" : "-left-96"
        } md:w-64 fixed sm:relative sm:-left-0 min-w-64 z-10 transition-transform   p-2 py-5 min-h-screen bg-background border-r-foreground border-r-[.5px]`}
      >
        <div className="text-xl text-center pt-10">Dashboard</div>
        <div className="flex flex-col gap-2 pt-10 ">
          {bar.map((item, idx: number) => {
            return (
              <Button
                key={idx}
                variant={"ghost"}
                onClick={() => push(item.href)}
                className={`${
                  "/" + path.split("/").splice(2).join("/") == item.href ||
                  "/dashboard/" + path.split("/")[3] == item.href
                    ? "bg-accent text-accent-foreground"
                    : ""
                } w-full min-w-full font-medium flex justify-start gap-4 items-center ring-1 ring-primary`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Button>
            );
          })}
        </div>
        <Button
          variant={"ghost"}
          className="absolute bottom-0 inset-x-0 text-red-600 mx-auto block min-w-full"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default SideBarDashboard;
