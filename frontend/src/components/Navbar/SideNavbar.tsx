"use client";
import { useState } from "react";
import SearchProduct from "../SearchProduct";
import { Button } from "../ui/button";
import Link from "next/link";
import { Menu } from "./index";

const nav = [
  {
    name: "all products",
    href: "/products",
  },
  {
    name: "pesanan",
    href: "/order",
  },
];

interface Props {
  open: boolean;
  onClose?: () => void;
}
const SideNavbar = ({ open, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <div
      className={`${
        open ? "-left-0" : "-left-[800px]"
      } w-full top-20 px-4 overflow-hidden border-t py-6 md:hidden p-4  bg-background duration-200 transition-all  md:border-l md:border-foreground/30 min-h-screen fixed inset-y-0 z-50 `}
    >
      <div className="mx-auto w-full max-w-72 flex justify-center">
        <SearchProduct />
      </div>
      <div className="pt-5">
        {nav.map((n, idx) => (
          <Link onClick={onClose} key={idx} href={n.href} className="block">
            <Button variant={"link"}>{n.name}</Button>
          </Link>
        ))}
      </div>
      <div className="px-4">
        <Menu />
      </div>
    </div>
  );
};

export default SideNavbar;