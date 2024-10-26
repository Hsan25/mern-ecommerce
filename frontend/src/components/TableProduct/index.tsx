"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import apiService from "@/lib/axios";
import type { Pagination, Product, User } from "@/types";
import { Button } from "../ui/button";
import TableSkeleton from "../TableSkeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PaginationProduct from "../Pagination";
import { useToast } from "../ui/use-toast";
import AlertDialog from "../AlertDialog";
import Image from "next/image";
import { formatIDR } from "@/utils";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

const TableProduct = () => {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const page = searchParams.get("page") || 1;
  const { data, isLoading } = useSWR<{
    products: Product[];
    pagination: Pagination;
  }>(`/products?limit=10&detail=true&page=${Number(page)}`, fetcher);
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await apiService.delete(`/products/${id}`);
      toast({
        title: "Delete product success",
        description: `user with id ${id} deleted.`,
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Delete user failed",
      });
      console.error(error);
    }
  };

  useEffect(() => {
    const page = searchParams.get("page");
    if (!page) replace(`${pathname}?page=${1}`);
  }, [searchParams, pathname, replace]);
  return (
    <>
      <Table>
        <TableCaption>
          {!isLoading ? (data?.products ? "List product" : "no products") : "Loading..."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>stock</TableHead>
            <TableHead>sold_count</TableHead>
            <TableHead>price</TableHead>
            <TableHead>ratings</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!isLoading ? (
            data?.products?.map((product, idx) => (
              <TableRow key={idx}>
                <TableCell className="">{idx + 1}</TableCell>
                <TableCell className="text-sm max-w-[400px] truncate ">
                  {product.name}
                </TableCell>
                <TableCell className="text-sm max-w-[50px]">
                  <div className="relative w-10 h-10">
                    <Image
                      src={product.images[0]}
                      fill={true}
                      alt={"Image product"}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.stock}</TableCell>
                <TableCell className="text-sm">{product.sold_count}</TableCell>
                <TableCell className="text-sm">
                  {formatIDR(product.price)}
                </TableCell>
                <TableCell className="text-sm">{product.ratings}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  <Button
                    onClick={() => push(`${pathname}/update/${product._id}`)}
                    size={"xs"}
                    variant={"default"}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => push(`${pathname}/detail/${product._id}`)}
                    size={"xs"}
                    variant={"outline"}
                  >
                    Detail
                  </Button>
                  <Button
                    onClick={() => setOpen(!open)}
                    size={"xs"}
                    variant={"destructive"}
                  >
                    <AlertDialog
                      title={"Delete User"}
                      description={`apakah anda yakin ingin menghapus product ${product.name}`}
                      open={open}
                      onContinue={() => {
                        handleDeleteProduct(product._id);
                        setOpen(!open);
                      }}
                      onCancel={() => setOpen(false)}
                    />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <TableSkeleton row={8} key={idx} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
      {data?.pagination ? (
        <PaginationProduct totalPages={data.pagination.totalPages} />
      ) : null}
    </>
  );
};

export default TableProduct;
