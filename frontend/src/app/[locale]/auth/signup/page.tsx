"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/authContext";
import { FaGoogle } from "react-icons/fa";
import { Signup } from "@/types";
import signupSchema from "@/lib/zod/schemaSignup";

const RegisterPage = () => {
  const [error, setError] = useState<string>("");
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { signup } = useAuth();
  const { register, handleSubmit, reset } = useForm<Signup>();

  const onSubmit: SubmitHandler<Signup> = async (data) => {
    try {
      setIsLoading(true);
      const safe = signupSchema.parse(data);
      await signup(safe);
      reset();
      setError("");
      toast({
        description: "Register Success.",
      });
      push("/auth/login");
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
    <div className="bg-background min-h-screen p-3 flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="w-full bg-black p-4 max-w-sm border border-ring rounded-sm h-[30rem] md:h-[28rem] "
      >
        <div className="text-center text-bold text-xl">Signup</div>
        {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
        <div className="flex flex-col gap-4 py-2">
          <Input
            type="text"
            placeholder="Username"
            {...register("username", { required: true })}
          />
          <Input
            type="email"
            placeholder="Your Email"
            {...register("email", { required: true })}
          />
          <Input
            type="password"
            placeholder="Your Password"
            {...register("password", { required: true })}
          />
          <Button disabled={isLoading} className={`ml-auto`} size={"sm"}>
            {isLoading ? "Submiting..." : "Submit"}
          </Button>
        </div>
        <div className="text-sm text-center">
          already have an account?
          <Link href={"/auth/login"}>
            <Button variant={"link"} type="button" size={"sm"}>
              Login
            </Button>{" "}
          </Link>
        </div>
        <div className="text-center">or</div>
        <div className="flex w-full flex-col gap-3 items-center pt-4">
          <Button
            className="w-56 max-w-full flex gap-3 items-center "
            size={"sm"}
            onClick={() =>
              push(`${process.env.NEXT_PUBLIC_SERVER_API}/auth/google`)
            }
          >
            <FaGoogle size={20} />
            <span>Login With Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
