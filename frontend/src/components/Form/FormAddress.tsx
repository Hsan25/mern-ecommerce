"use client";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import states from "@/data/state.json";
import { usePathname, useRouter } from "next/navigation";
import { Address } from "@/types/address";
import { useAuth } from "@/context/authContext";
import { schemaAddress } from "@/lib/zod/schemaAddress";
import { z } from "zod";
import SelectCustom from "../SelectCustom";
import InputLabel from "../InputLabel";
import { useOrder } from "@/context/orderContext";
import { useTranslations } from "next-intl";
const FormAddress = () => {
  const { register, handleSubmit } = useForm();
  const [state, setState] = useState<string>("Jawa Barat");
  const [error, setError] = useState<string>("");
  const path = usePathname();
  const { replace } = useRouter();
  const { user } = useAuth();
  const { setAddress, order } = useOrder();
  const address = order?.address;
  const t = useTranslations("form");
  const onSubmit = async (data: any) => {
    try {
      const address = {
        ...data,
        user: user?._id,
        country: "Indonesia",
        state,
      } as Address;
      const safe = schemaAddress.parse(address);
      setAddress(safe as Address);
      replace(`${path}?current=shipping`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return setError(
          error.issues[0].path[0] + ": " + error.issues[0].message
        );
      }
    }
  };
  return (
    <>
      {address ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 px-6 max-w-lg lg:mx-0 lg:max-w-2xl mx-auto lg:px-14 w-full lg:w-1/2"
        >
          {error && <p className="text-red-600">{error}</p>}
          <div className="text-lg fond-semibold">Contact</div>
          <InputLabel
            label="Email"
            type="text"
            defaultValue={user?.email || ""}
            {...register("email", { required: true })}
          />
          <InputLabel
            label="phoneNumber"
            type="text"
            defaultValue={address.phoneNumber || ""}
            {...register("phoneNumber", { required: true })}
          />
          <div className="py-6">
            <div className="text-lg font-semibold">
              {t("address.shippingAddress")}
            </div>
            <SelectCustom
              defaultValue="Indonesia"
              placeholder="Select a country"
              label="Country"
              items={[{ name: "Indonesia", value: "Indonesia" }]}
            />
            <div className="flex flex-col gap-4 pt-8">
              <InputLabel
                label="Full Name"
                type="text"
                defaultValue={address.name || ""}
                {...register("name", { required: true })}
              />
              <InputLabel
                label="Address"
                type="text"
                defaultValue={address.address || ""}
                {...register("address", { required: true })}
              />

              <InputLabel
                label="note(apartement/home) (optional)"
                type="text"
                defaultValue={address.notes || ""}
                {...register("notes")}
              />
              <div className="flex items-center gap-2">
                <InputLabel
                  label="City"
                  type="text"
                  defaultValue={address.city || ""}
                  {...register("city")}
                />
                <div className="w-full">
                  <Label className="text-sm">state</Label>
                  <SelectCustom
                    label="state"
                    placeholder="Select a state"
                    defaultValue={address.state}
                    onValueChange={(val) => setState(val)}
                    items={states.map((s, _) => ({ name: s, value: s }))}
                  />
                </div>

                <InputLabel
                  label="Zip Code"
                  type="text"
                  defaultValue={address.zipCode || ""}
                  {...register("zipCode")}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Continue to Shipping</Button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 px-6 max-w-lg lg:mx-0 lg:max-w-2xl mx-auto lg:px-14 w-full lg:w-1/2"
        >
          {error && <p className="text-red-600">{error}</p>}
          <div className="text-lg fond-semibold">Contact</div>
          <InputLabel
            label="Email"
            defaultValue={user?.email || ""}
            type="email"
            {...register("email", { required: true })}
          />
          <InputLabel
            label="phoneNumber"
            type="text"
            {...register("phoneNumber", { required: true })}
          />
          <div className="py-6">
            <div className="text-lg font-semibold">Shipping Address</div>
            <SelectCustom
              defaultValue="Indonesia"
              placeholder="Select a country"
              label="Country"
              items={[{ name: "Indonesia", value: "Indonesia" }]}
            />
            <div className="flex flex-col gap-4 pt-8">
              <InputLabel
                label="FullName"
                type="text"
                {...register("name", { required: true })}
              />
              <InputLabel
                label="Address"
                type="text"
                {...register("address", { required: true })}
              />
              <InputLabel
                label="note apartement/home (optional)"
                type="text"
                {...register("notes", { required: true })}
              />
              <div className="flex items-center gap-2">
                <InputLabel
                  label="city"
                  type="text"
                  {...register("city", { required: true })}
                />
                <div className="w-full">
                  <Label className="text-sm">state</Label>
                  <SelectCustom
                    label="state"
                    placeholder="Select a state"
                    defaultValue="Jawa Barat"
                    onValueChange={(val) => setState(val)}
                    items={states.map((s, _) => ({ name: s, value: s }))}
                  />
                </div>
                <InputLabel
                  label="zipCode"
                  type="text"
                  {...register("zipCode", { required: true })}
                />
              </div>
            </div>
          </div>
          <Button type="submit">Continue to Shipping</Button>
        </form>
      )}
    </>
  );
};

export default FormAddress;
