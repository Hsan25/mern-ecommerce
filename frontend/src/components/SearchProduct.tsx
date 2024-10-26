"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { IoMdSearch } from "react-icons/io";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";

const SearchProduct = () => {
  const path = usePathname();
  const t = useTranslations("");
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const onSubmitSearch = (search: string) => {
    const p = path.split("/");
    push(`/products?search=${search}`);
  };
  return (
    <form
      onSubmit={(e: any) => {
        onSubmitSearch(e.target.search.value || "");
      }}
      className="relative sm:block sm:w-full w-60">
      <Input
        type="text"
        name="search"
        className="w-full"
        required={true}
        placeholder={t("searchProduct")}
      />
      <button type="submit" className="absolute right-2 top-3 cursor-pointer">
        <IoMdSearch size={24} />
      </button>
    </form>
  );
};

export default SearchProduct;
