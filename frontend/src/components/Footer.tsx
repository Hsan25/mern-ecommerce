"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import ChangeLanguage from "./ChangeLanguange";

const option = [
  {
    name: "all products",
    href: "/products",
  },
  {
    name: "about",
    href: "/about",
  },
  {
    name: "FAQ",
    href: "/faq",
  },
  {
    name: "Terms & conditions",
    href: "/terms-conditions",
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
];

const disableFooter = ["dashboard", "auth", "checkout", "profile"];

const Footer = () => {
  const path = usePathname();

  if (disableFooter.includes(path.split("/")[2])) {
    return null;
  }
  return (
    <div className="w-full min-h-80 sm:min-h-60 p-6 sm:p-8 mt-24 border-t border-foreground">
      <div className="flex gap-5 flex-col sm:flex-row justify-between">
        <Link href={"/"} className="title text-lg font-medium">
          GALAXY STORE
        </Link>
        <div className="flex gap-2 flex-col">
          {option.map((o, idx) => (
            <Link key={idx} href={o.href} className="relative hover:underline">
              {o.name}
            </Link>
          ))}
        </div>
        <div className="">
          <div className="">
            &copy; 2024 | Created By{" "}
            <Link
              className="text-blue-600 hover:underline"
              href={"https://hsan25.vercel.app"}
              target="_blank"
            >
              @Hsan
            </Link>
          </div>
          {/* <div className="">
            Web Reference{" "}
            <Link
              href={"https://demo.vercel.store/"}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              web.
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Footer;
