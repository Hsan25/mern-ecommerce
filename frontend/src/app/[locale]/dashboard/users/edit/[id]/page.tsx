"use client";
import React from "react";

import FormUpdateUser from "@/components/Form/FormUpdateUser";
interface Props {
  params: {
    id: string;
  };
}
const EditUserPage = ({ params }: Props) => {
  return (
    <>
      <div className="text-lg font-medium">Edit User</div>
      <FormUpdateUser id={params.id} />
    </>
  );
};

export default EditUserPage;
