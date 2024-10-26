"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { IoCart } from "react-icons/io5";
import Cart from "../Cart";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchProduct from "../SearchProduct";
import SideNavbar from "./SideNavbar";
const disableNavbar = ["dashboard", "auth", "checkout", "profile"];
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
const nav = [
  {
    name: "all products",
    href: "/products",
  },
  {
    name: "pakaian",
    href: "/products/category/Pakaian",
  },
];

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChangeLanguange from "../ChangeLanguange";

export const Menu = () => {
  const [open, setOpen] = useState<boolean>(false);
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
  return (
    <>
      <div className="hidden md:block relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center gap-x-1 leading-6 ">
          <span className="text-lg">Menu</span>
          {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
        <div
          className={`${
            open ? "h-60" : "h-0 opacity-0"
          } absolute p-2 transition-all  border w-48 bg-background border-foreground max-w-md delay-0 left-1/2 z-10 mt-5 flex -translate-x-1/2 px-4`}>
          <div className="flex overflow-hidden flex-col gap-2">
            {menu.map((m, idx) => (
              <Link
                href={m.href}
                onClick={() => setOpen(false)}
                key={idx}
                className="hover:underline">
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="md:hidden w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Menu</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2 ml-3">
              {menu.map((m, idx) => (
                <Link href={m.href} key={idx} className="hover:underline">
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

const Navbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const path = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { push } = useRouter();

  if (disableNavbar.includes(path.split("/")[2])) {
    return null;
  }

  return (
    <>
      <SideNavbar open={isOpen} onClose={() => setIsOpen(!isOpen)} />
      <nav className="h-20 p-5 flex items-center justify-between border-b border-foreground/5">
        <div
          onClick={() => {
            document.body.classList.toggle("freeze");
            setIsOpen(!isOpen);
          }}
          id="sidebar-toggle"
          className={`${
            isOpen ? "active" : ""
          } toggle  relative md:hidden cursor-pointer flex flex-col w-8 z-20 h-5 justify-between`}>
          <span
            className={` bg-primary transition-transform origin-top-right rounded-sm w-full h-1 block`}></span>
          <span className={` bg-primary rounded-sm transition-transform  w-full h-1 block`}></span>
          <span
            className={` bg-primary transition-transform origin-bottom-right rounded-sm w-full h-1 block`}></span>
        </div>

        <div className="flex gap-5 items-center justify-between">
          <Link href={"/"} className="title">
            <h1 className="">Galaxy Store</h1>
          </Link>
          <div className="gap-4 hidden md:flex">
            {nav.map((n, idx) => (
              <Link key={idx} href={n.href} className="text-sm hover:underline">
                {n.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden w-60 md:block">
          <SearchProduct />
        </div>
        <div className="hidden md:block">
          <Menu />
        </div>
        <ChangeLanguange />
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => {
            document.body.classList.toggle("freeze");
            setOpenCart(!openCart);
          }}>
          <IoCart size={22} />
        </Button>
        {openCart ? (
          <Cart
            open={openCart}
            onClose={() => {
              document.body.classList.remove("freeze");
              setOpenCart(!openCart);
            }}
          />
        ) : null}
      </nav>
    </>
  );
};

export default Navbar;
