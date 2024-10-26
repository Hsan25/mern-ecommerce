"use client";
import CarouselProduct from "@/components/CarouselProduct";
import CarouselPromotion from "@/components/CarouseiPromotion";
import { Product } from "@/types";
import { Suspense } from "react";
import ListProduct from "@/components/Product/ListProduct";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useTranslations } from "next-intl";

const Home = () => {
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    `/products?limit=10&page=1`,
    fetcher
  );
  const t = useTranslations();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="min-h-screen pt-10 bg-background">
        <div className=" mb-2 justify-center rounded flex flex-col sm:flex-row gap-2 w-full h-48 sm:h-64 ">
          <CarouselProduct />
          <CarouselPromotion />
        </div>
        <p className="font-bold text-lg">{t("welcome")}</p>

        <div className="py-16 ">
          {isLoading && <p>Loading...</p>}
          {data?.products ? (
            <>
              <ListProduct products={data.products} />
              <Link href={"/products"} className="flex mx-auto max-w-max py-9">
                <Button variant={"outline"} className="rounded-none mx-auto">
                  Show More
                </Button>
              </Link>
            </>
          ) : (
            <>{!isLoading && <p>Product Not Found</p>}</>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
