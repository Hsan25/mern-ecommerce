"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import SideNavbar from "./SideNavbar";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/context/authContext";

const menu = [
  {
    name: "profile",
    href: "/profile",
  },
  {
    name: "order",
    href: "/order",
  },
];
export const Menu = ({ onClick }: { onClick?: () => void }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { logout } = useAuth();
  return (
    <>
      <div className="hidden md:block relative">
        <Button
          type="button"
          onClick={() => setOpen(!open)}
          variant={"outline"}
          size={"sm"}
        >
          <FaUser size={18} />
        </Button>
        <div
          className={`${
            open ? "h-60" : "h-0 opacity-0"
          } absolute flex-col justify-between p-2 transition-all  rounded border w-48 bg-background border-foreground max-w-md delay-0  z-40 mt-5 flex -translate-x-1/2 px-4`}
        >
          <div className="flex overflow-hidden flex-col gap-2">
            {menu.map((m, idx) => (
              <Link
                href={m.href}
                onClick={() => setOpen(false)}
                key={idx}
                className="hover:underline"
              >
                {m.name}
              </Link>
            ))}
          </div>
          <Button onClick={logout} variant={"outline"} className="text-red-600">
            logout
          </Button>
        </div>
      </div>
      <div className="md:hidden w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Menu</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 ml-3">
              {menu.map((m, idx) => (
                <Link
                  href={m.href}
                  key={idx}
                  onClick={onClick}
                  // onClick={() => setSideBar()} // side in mobile screen
                  className="hover:underline"
                >
                  {m.name}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};

export default Menu;
