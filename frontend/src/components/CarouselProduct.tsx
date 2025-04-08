import AutoScroll from "embla-carousel-auto-scroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";
import Loading from "./Loading";

const CarouselProduct = () => {
  const { data, isLoading } = useSWR<{
    products: Product[];
  }>(
    `/products?limit=10&page=1
    }`,
    fetcher
  );

  return (
    <Carousel
      plugins={[AutoScroll({ active: true, playOnInit: true })]}
      className="w-full max-w-2xl  h-full"
    >
      <CarouselContent>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data?.products && data.products.length > 0 ? (
              data.products.map((p, idx) => (
                <CarouselItem key={idx}>
                  <Link
                    href={`/products/${p._id}`}
                    className="border-2 rounded bg-black relative h-40 sm:h-64 flex justify-center items-center border-foreground"
                  >
                    <Image
                      src={p.images[0].url}
                      alt={"image product"}
                      fill={true}
                    />
                    <div className="absolute z-10 bottom-0 text-sm bg-background/50  p-2">
                      {p.name}
                    </div>
                  </Link>
                </CarouselItem>
              ))
            ) : (
              <CarouselItem>
                <p>product not available</p>
              </CarouselItem>
            )}
          </>
        )}
      </CarouselContent>
    </Carousel>
  );
};

export default CarouselProduct;
