import { Category } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface SortBy {
  name: string;
  by: { name: string; value: string }[];
}
const sortBy: SortBy[] = [
  {
    name: "price",
    by: [
      {
        name: "High To Low",
        value: "priceHighToLow",
      },
      {
        name: "Low To High",
        value: "priceLowToHigh",
      },
    ],
  },
];

const FilterProduct = () => {
  const path = usePathname();
  const { data, isLoading, mutate } = useSWR<{ categories: Category[] }>("/categories", fetcher);
  const { push, replace } = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const p = path.split("/").pop() || "";
  const category = decodeURI(p);
  const searchParams = useSearchParams();
  const handleChangeCategory = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    replace(`/products/category/${val}`);
  };
  const handleChangeSortBy = (e: ChangeEvent<HTMLInputElement>, name: string) => {
    const val = e.target.value;
    replace(`${path}?sortBy=${val}`);
  };
  return (
    <>
      <Button onClick={() => setOpen(!open)} className="md:hidden block max-w-40">
        Filter Product
      </Button>
      <div
        className={`${
          open ? "!block" : ""
        } hidden border rounded-sm border-foreground md:block sm:min-w-60 p-2`}>
        <div className="justify-between flex">
          <div className="text-base">Filter Product</div>
          <Button disabled={!searchParams.toString() && path.split('/')[3] != 'category'} onClick={() => replace("/products")} size={"xs"}>
            Reset
          </Button>
        </div>
        <div className="pt-5">
          <div className="">Sort By</div>
          {sortBy.map((s, idx) => (
            <div key={idx} className="ml-2">
              <div className="text-base">{s.name}</div>
              {s.by.map((b, idx) => (
                <div className="flex ml-2 gap-5 items-center min-h-9 min-w-full " key={idx}>
                  <Input
                    value={b.value}
                    type="radio"
                    checked={searchParams.get("sortBy") == b.value}
                    onChange={(e) => handleChangeSortBy(e, s.name)}
                    className="h-5 w-5 cursor-pointer"
                    id={b.name}
                  />
                  <label
                    htmlFor={b.name}
                    className="hover:underline cursor-pointer text-sm text-left">
                    {b.name}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="py-5">
          <div className="text-base text-left">Category</div>
          {data?.categories.map((c, idx) => (
            <div className="flex gap-5 items-center min-h-9 min-w-full" key={idx}>
              <Input
                onChange={handleChangeCategory}
                value={c.name}
                type="radio"
                checked={category == c.name}
                className="h-5 w-5 cursor-pointer"
                id={c.name}
              />
              <label htmlFor={c.name} className=" hover:underline cursor-pointer text-sm text-left">
                {c.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterProduct;
