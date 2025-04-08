"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { FaShoppingCart } from "react-icons/fa";
import Cart from "../Cart";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchProduct from "../SearchProduct";
import SideNavbar from "./SideNavbar";
const disableNavbar = ["dashboard", "auth", "checkout", "profile"];
const nav = [
  {
    name: "all products",
    href: "/products",
  },
];
import { useAuth } from "@/context/authContext";
import Menu from "./Menu";
import AuthButton from "./AuthButton";
import BurgerMenu from "./BurgerMenu";

const Navbar = () => {
  const [openCart, setOpenCart] = useState<boolean>(false);
  const path = usePathname();
  const { isAuthenticate } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (disableNavbar.includes(path.split("/")[2])) {
    return null;
  }

  return (
    <>
      <SideNavbar open={isOpen} onClose={() => setIsOpen(!isOpen)} />
      <nav className="h-20 sm:p-2 relative p-4 flex items-center justify-between border-b border-foreground/50">
        <BurgerMenu
          onClick={() => {
            document.body.classList.toggle("freeze");
            setIsOpen(!isOpen);
          }}
          open={isOpen}
        />

        <div className="flex sm:gap-2 gap-6 items-center sm:justify-center">
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

        <SearchProduct />

        {isAuthenticate ? (
          <div className="flex items-center gap-2 ">
            <div className="hidden md:block">
              <Menu />
            </div>
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={() => {
                document.body.classList.toggle("freeze");
                setOpenCart(!openCart);
              }}
            >
              <FaShoppingCart size={22} />
            </Button>
            {openCart && (
              <Cart
                open={openCart}
                onClose={() => {
                  document.body.classList.remove("freeze");
                  setOpenCart(!openCart);
                }}
              />
            )}
          </div>
        ) : (
          <div className="hidden sm:block">
            <AuthButton />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
