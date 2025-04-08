"use client";
import FormUpdateProduct from "@/components/Form/FormUpdateProduct";
import React from "react";
const UpdateProductPage = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <FormUpdateProduct id={params.id} />
    </>
  );
};

export default UpdateProductPage;
