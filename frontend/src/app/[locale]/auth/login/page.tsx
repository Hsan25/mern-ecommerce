"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { delay } from "@/lib/utils";
import { useAuth } from "@/context/authContext";
import { FaGoogle } from "react-icons/fa6";
const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("Invalid Email"),
  password: z
    .string()
    .min(5, { message: "must contain at least 5 character(s)" }),
});
const LoginPage = () => {
  const [error, setError] = useState<string>("");
  const { push } = useRouter();
  const { isAuthenticate, login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  interface Inputs {
    email: string;
    password: string;
  }

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true);
      await delay(500);
      const safe = LoginSchema.parse(data);
      const result = await login(safe);
      reset();
      setError("");
      toast({
        description: "Login Success.",
      });
      if (redirectPath) {
        push(decodeURIComponent(redirectPath));
      } else push("/");
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
        className="w-full p-4 max-w-sm border border-ring rounded-sm h-[28rem] md:h-[27rem]"
      >
        <div className="text-center text-bold text-xl">Login</div>
        {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
        <div className="flex flex-col gap-4 py-2">
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
          <Button disabled={isLoading} type="submit" className={`ml-auto`}>
            {isLoading ? "Submiting..." : "Submit"}
          </Button>
        </div>
        <div className="text-sm text-center">
          don{"'"}t have an account?
          <Link href={"/auth/register"}>
            <Button variant={"link"} type="button">
              Register
            </Button>{" "}
          </Link>
        </div>
        <div className="text-center">or</div>
        <div className="flex w-full flex-col gap-3 items-center pt-4">
          <Button
            className="w-56 max-w-full flex gap-3 items-center "
            size={"sm"}
          >
            <FaGoogle size={20} />
            <span>Login With Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
