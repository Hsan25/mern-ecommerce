"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { delay } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import apiService from "@/lib/axios";
import { Category } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import InputLabel from "@/components/InputLabel";
import SelectCustom from "@/components/SelectCustom";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { FormFieldProduct } from "@/types/product";
import { schemaProduct } from "@/lib/zod/schemaProduct";
import Loading from "../Loading";
const FormAddProduct = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { push } = useRouter();
  const [file, setFile] = useState<MediaSource | Blob | null>(null);
  const [category, setCategory] = useState<string>("");
  const { data, isLoading: loadingCategories } = useSWR<{
    categories: Category[];
  }>(`/categories`, fetcher);
  const { register, handleSubmit, reset } = useForm<FormFieldProduct>();

  const onSubmit: SubmitHandler<FormFieldProduct> = async (data) => {
    try {
      setIsLoading(true);
      await delay(100);
      const safe = schemaProduct.parse({
        ...data,
        stock: Number(data.stock),
        price: Number(data.price),
        ratings: Number(data.ratings),
        seller: user?._id,
      });
      const result = await apiService.post(
        `/products`,
        {
          product: { ...safe, categories: [category] },
          image: file || null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (result.status == 400) {
        throw new Error("Failed Add Product");
      }
      reset();
      setError("");
      toast({
        description: "Add Product success !!!",
      });
      push("/dashboard/products");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].path[0] + ": " + error.issues[0].message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingCategories) return <Loading/>;
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="max-w-sm pt-8 mx-auto flex flex-col gap-3"
      >
        {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
        <InputLabel
          label="name product"
          placeholder="name"
          {...register("name", { required: true })}
        />
        <InputLabel
          label="price"
          type="number"
          placeholder="price"
          {...register("price", { required: true })}
        />
        <InputLabel
          label="stock"
          type="number"
          placeholder="stock"
          {...register("stock", { required: true })}
        />
        <InputLabel
          label="ratings"
          type="number"
          placeholder="ratings"
          {...register("ratings", { required: true })}
        />
        {data && data?.categories && (
          <div>
            <label>Category Product</label>
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
          <label>description</label>
          <Textarea
            placeholder="description"
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
          {file ? (
            <Image
              src={URL.createObjectURL(file)}
              fill={true}
              alt={"Image Product"}
            />
          ) : null}
          <p className="absolute text-sm inset-0 w-max mx-auto ">
            {!file ? "pilih file" : ""}
          </p>
          <p className="absolute text-xs w-full  -bottom-5 ">
            only(jpg,jpeg,png)
          </p>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submiting..." : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default FormAddProduct;
