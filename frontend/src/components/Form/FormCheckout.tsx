"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormAddress from "@/components/Form/FormAddress";
import FormShipping from "@/components/Form/FormShipping";
import FormPayment from "@/components/Form/FormPayment";
import { useOrder } from "@/context/orderContext";
// cart id (for address products)
interface Props {
  params: {
    id: string;
  };
}

const FormCheckOut = () => {
  const path = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const { order } = useOrder();
  const current: string = searchParams.get("current") || "address";
  const nameForm = ["address", "shipping", "payment"];
  const forms = [
    {
      name: "address",
      form: <FormAddress key={"address"} />,
    },
    {
      name: "shipping",
      form: <FormShipping key={"shipping"} />,
    },
    {
      name: "payment",
      form: <FormPayment key={"payment"} />,
    },
  ];

  useEffect(() => {
    if (order && current) {
      return;
    }
    replace(`${path}?current=address`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!nameForm.includes(current)) {
    return <p>NOT FOUND</p>;
  }
  return (
    <>
      {forms.map((el) => {
        if (el.name == current) return el.form;
      })}
    </>
  );
};

export default FormCheckOut;
