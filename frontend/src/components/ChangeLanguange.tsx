import React, { useState } from "react";
import { IoLanguage } from "react-icons/io5";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
const langs = [
  {
    lang: "ID",
    locale: "id",
  },
  {
    lang: "EN",
    locale: "en",
  },
];
const ChangeLanguange = () => {
  const path = usePathname();
  // console.log(path.splice(2));
  const [openLang, setOpenLang] = useState<boolean>(false);
  return (
    <div className="relative">
      <div
        className={`${
          openLang ? "flex" : "hidden"
        } absolute -left-16 bg-black border-rounded flex-col`}>
        {langs.map((l, idx) => (
          <Link
            className="text-sm p-2 text-white hover:bg-slate-50/30"
            key={idx}
            onClick={() => setOpenLang(false)}
            href={[`/${l.locale}`, ...path.split("/").splice(2)].join("/")}
            locale={l.locale}>
            {l.lang}
          </Link>
        ))}
      </div>
      <Button
        onClick={() => setOpenLang(!openLang)}
        size={"sm"}
        className="border"
        variant={"ghost"}>
        <IoLanguage size={20} />
      </Button>
    </div>
  );
};

export default ChangeLanguange;
