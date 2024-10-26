"use client";
import FormUpdateProduct from "@/components/Form/FormUpdateProduct";
import React from "react";
const UpdateProductPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="text-lg font-medium">Update Product</div>
      <FormUpdateProduct id={params.id} />
    </>
  );
};

export default UpdateProductPage;
