"use client";
import AlertDialog from "@/components/AlertDialog";
import Loading from "@/components/Loading";
import OtherProducts from "@/components/OtherProducts";
import Rating from "@/components/Product/Rating";
import ReviewsProducts from "@/components/Product/ReviewProduct";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import apiService from "@/lib/axios";
import { fetcher } from "@/lib/fetcher";
import { delay } from "@/lib/utils";
import { Product } from "@/types";
import { formatIDR } from "@/utils";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";

interface Props {
  params: {
    id: string;
  };
}
const ProductDetailPage = ({ params }: Props) => {
  const [loadingAddCart, setLoadingAddCart] = useState<boolean>(false);
  const { user, isAuthenticate } = useAuth();
  const { push } = useRouter();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const {
    data: product,
    isLoading,
    error,
  } = useSWR<Product>(
    `/products/${params.id}`,
    async (url: string) => await fetcher(url, "product")
  );

  const handleAddCart = async (id: string) => {
    setLoadingAddCart(true);
    if (!isAuthenticate) {
      setOpenDialog(true);
      setLoadingAddCart(false);
      return;
    }
    try {
      const res = await apiService.post(`/carts/${user?._id}/add_item`, {
        product: id,
      });
      toast({
        description: "add item success",
        duration: 1000,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({
          description: error.response?.data.msg || "",
          duration: 3000,
        });
        return;
      }
      toast({
        description: "Failed add item",
        duration: 1000,
      });
    } finally {
      await delay(500);
      setLoadingAddCart(false);
    }
  };
  if (isLoading) return <Loading />;
  if (error) return <p>Error...</p>;
  if (!product) return <p>Product Not Found</p>;
  return (
    <>
      <AlertDialog
        open={openDialog}
        description="Login untuk melanjutkan."
        onCancel={() => setOpenDialog(false)}
        onContinue={() => push("/auth/login")}
      />
      <div className="grid-cols-1  md:grid-cols-2 grid gap-5 w-full min-h-screen">
        <div className="w-full bg-black relative min-h-60 rounded-md border-foreground border-2">
          <Image
            src={product?.images[0].url || ""}
            alt="image product"
            fill={true}
          />
        </div>
        <div className="w-full bg-black rounded-md p-2 relative flex flex-col gap-2 min-h-80 h-full border-foreground border-2">
          <div className="flex justify-between gap-1 items-start">
            <div className="text-xl">{product?.name}</div>
            <Rating rating={product?.ratings} />
          </div>
          <div className="text-base">{formatIDR(product?.price || 0)}</div>
          <div className="text-base">
            stock:<span>{product?.stock}</span>
          </div>
          <div className="text-base">
            sold:<span>{product?.sold_count}</span>
          </div>
          <div className="text-base">
            <span>Categories: </span>
            {product?.categories.map((c, idx) => (
              <Link href={`/products/category/${c.name}`} key={idx}>
                <Button size={"xs"} className="text-sm">
                  {c.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="text-base">
            <span className="block">Description: </span>
            <div className="">{product?.description}</div>
          </div>
          <Button
            disabled={loadingAddCart}
            onClick={() => handleAddCart(product?._id || "")}
            className=" w-60 mx-auto self-baseline "
          >
            {loadingAddCart ? "added..." : "add to cart"}
          </Button>
        </div>
        <ReviewsProducts id={product?._id || ""} />
        <OtherProducts product={product} />
      </div>
    </>
  );
};

export default ProductDetailPage;
