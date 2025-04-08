"use client";
import CarouselProduct from "@/components/CarouselProduct";
import CarouselPromotion from "@/components/CarouseiPromotion";
import { Product } from "@/types";
import ListProduct from "@/components/Product/ListProduct";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useTranslations } from "next-intl";
import Loading from "@/components/Loading";

const Home = () => {
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    `/products?limit=10&page=1`,
    fetcher
  );
  const t = useTranslations();

  return (
    <div className="min-h-screen pt-10 bg-background">
      <div className=" mb-2 justify-center rounded flex flex-col sm:flex-row gap-2 w-full h-48 sm:h-64 ">
        <CarouselProduct />
        <CarouselPromotion />
      </div>
      <p className="font-bold text-lg mt-5">{t("welcome")}</p>

      <div className="py-16 ">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data?.products ? (
              <>
                <ListProduct products={data.products} />
                <Link
                  href={"/products"}
                  className="flex mx-auto max-w-max py-9"
                >
                  <Button variant={"outline"} className="rounded-none bg-black mx-auto">
                    Show More
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <p>Product Not Available</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
