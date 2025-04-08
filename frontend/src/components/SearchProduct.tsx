"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
const SearchProduct = () => {
  const path = usePathname();
  const t = useTranslations("");
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onSubmitSearch = (search: string) => {
    const p = path.split("/");
    push(`/products?search=${search}`);
  };
  return (
    <div className="">
      <Button
        className="md:hidden"
        size={"sm"}
        variant={"outline"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdSearch size={20} />
      </Button>
      <form
        onSubmit={(e: any) => {
          onSubmitSearch(e.target.search.value || "");
        }}
        className={`${
          isOpen ? "top-24 block inset-x-0" : "hidden"
        } absolute z-50 md:relative md:block w-72 `}
      >
        <Input
          type="text"
          name="search"
          className="w-full"
          required={true}
          placeholder={t("searchProduct")}
        />
        <button type="submit" className="absolute right-2 top-3 cursor-pointer">
          <IoMdSearch size={20} />
        </button>
      </form>
    </div>
  );
};

export default SearchProduct;
