"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { delay } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import SelectCustom from "@/components/SelectCustom";
import InputLabel from "@/components/InputLabel";
import { Register, useAuth } from "@/context/authContext";

const FormAddUser = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { register: RegisterUser } = useAuth();
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const { register, handleSubmit, reset } = useForm<Register>();
  const registeSchema = z.object({
    username: z
      .string()
      .min(5, { message: "must contain at least 5 character(s)" }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("Invalid Email"),
    password: z
      .string()
      .min(6, { message: "must contain at least 6 character(s)" }),
    role: z.enum(["ADMIN", "USER"]),
  });

  const onSubmit: SubmitHandler<Register> = async (data) => {
    console.log({ ...data, role });
    try {
      setIsLoading(true);
      await delay(500);
      const safe = registeSchema.parse({ ...data, role });
      const result = await RegisterUser(safe);
      reset();
      setError("");
      toast({
        description: "Register Success !!!",
      });
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

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="max-w-sm pt-8 mx-auto flex flex-col gap-3"
      >
        {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
        <InputLabel
          label="username"
          type="text"
          placeholder="Username"
          {...register("username", { required: true })}
        />
        <InputLabel
          label="email"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <InputLabel
          label="password"
          type="password"
          placeholder="Password (min *6)"
          {...register("password", { required: true })}
        />
        <SelectCustom
          placeholder="Select a role"
          label="Role user"
          items={[
            { name: "USER", value: "USER" },
            { name: "ADMIN", value: "ADMIN" },
          ]}
          onValueChange={(val: string) => setRole(val as "ADMIN" | "USER")}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Submiting..." : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default FormAddUser;