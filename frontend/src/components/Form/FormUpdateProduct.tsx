"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useAuth } from "@/context/authContext";
import apiService from "@/lib/axios";
import { Category, Product } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InputLabel from "../InputLabel";
import SelectCustom from "../SelectCustom";
import { Label } from "../ui/label";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FormFieldProduct } from "@/types/product";
import { schemaProduct } from "@/lib/zod/schemaProduct";
import Loading from "../Loading";

const FormUpdateProduct = ({ id }: { id: string }) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { push } = useRouter();
  const [file, setFile] = useState<MediaSource | Blob | null>(null);
  const [category, setCategory] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<FormFieldProduct>();
  const { data, isLoading: loadingCategories } = useSWR<{
    categories: Category[];
  }>(`/categories`, fetcher);
  const { data: product, isLoading: loadingProduct } = useSWR<Product>(
    `/products/${id}`,
    async () => await fetcher(`/products/${id}`, "product")
  );
  const onSubmit: SubmitHandler<FormFieldProduct> = async (data) => {
    try {
      setIsLoading(true);
      const safe = schemaProduct.parse({
        ...data,
        stock: Number(data.stock),
        price: Number(data.price),
        ratings: Number(data.ratings),
        seller: user?._id,
      });
      const result = await apiService.put(
        `/products/${id}`,
        {
          product: {
            ...safe,
            categories: [category || product?.categories[0]._id],
          },
          image: file || null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result.status == 400) {
        throw new Error("Failed Update Product");
      }
      reset();
      setError("");
      toast({
        description: "Update Product success !!!",
      });
      push(`/dashboard/products`);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].path[0] + ": " + error.issues[0].message);
      } else {
        setError((error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (loadingCategories || loadingProduct) return <Loading/>;
  return (
    <>
      <div className="text-lg font-medium">Update Product</div>
      {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="max-w-sm pt-8 mx-auto flex flex-col gap-3"
      >
        <InputLabel
          label="name"
          type="text"
          defaultValue={product?.name}
          placeholder="name"
          {...register("name", { required: true })}
        />
        <InputLabel
          label="price"
          type="number"
          placeholder="price"
          defaultValue={product?.price}
          {...register("price", { required: true })}
        />
        <InputLabel
          label="stock"
          type="number"
          defaultValue={product?.stock}
          placeholder="stock"
          {...register("stock", { required: true })}
        />
        <InputLabel
          label="rating"
          type="number"
          defaultValue={product?.ratings || ""}
          placeholder="ratings"
          {...register("ratings", { required: true })}
        />
        {data && data?.categories && (
          <div>
            <Label>Category Product</Label>
            <SelectCustom
              label="categories"
              placeholder="Select a category"
              onValueChange={(e) => {
                setCategory(e);
              }}
              items={data?.categories?.map((c) => ({
                name: c.name,
                value: c._id,
              }))}
            />
          </div>
        )}
        <div className="">
          <Label>Description</Label>
          <Textarea
            placeholder="description"
            defaultValue={product?.description}
            {...register("description", { required: true })}
          />
        </div>

        <div className="relative my-3 border w-52 mx-auto h-40 border-white rounded-md">
          <InputLabel
            label="image product"
            type="file"
            onChange={(e) => {
              if (e.target.files) setFile(e.target.files[0]);
            }}
            className=" cursor-pointer z-10 opacity-0 w-full block h-full absolute inset-0"
          />
          <Image
            src={file ? URL.createObjectURL(file) : product?.images[0].url || ""}
            fill={true}
            alt={"Image Product"}
          />

          <p className="absolute text-sm inset-0 w-max mx-auto ">
            {!file ? "pilih file" : ""}
          </p>
          <p className="absolute text-xs w-full  -bottom-5 ">
            only(jpg,jpeg,png)
          </p>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "saving..." : "save"}
        </Button>
      </form>
    </>
  );
};

export default FormUpdateProduct;
