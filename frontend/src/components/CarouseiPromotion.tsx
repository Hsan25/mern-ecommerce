"use client";
import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import apiService from "@/lib/axios";
import Image from "next/image";
import { useTranslations } from "next-intl";

// const promotions = ["Free Ongkir seluruh Indonesia", "Banyak Diskon"];
const CarouselPromotion = () => {
  const t = useTranslations("promotion");
  return (
    <Carousel
      plugins={[AutoScroll({ active: true, playOnInit: true })]}
      className="w-full  sm:max-w-xs  h-full">
      <CarouselContent>
        {/* {promotions?.map((p, idx) => ( */}
        <CarouselItem>
          <div className="border-2 h-full w-full sm:h-64 sm: flex justify-center items-center border-foreground">
            {t("discount")}
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="border-2 h-full w-full sm:h-64 sm: flex justify-center items-center border-foreground">
            {t("shipping")}
          </div>
        </CarouselItem>
        {/* ))} */}
      </CarouselContent>
      {/* <CarouselPrevious /> */}
      {/* <CarouselNext /> */}
    </Carousel>
  );
};

export default CarouselPromotion;
