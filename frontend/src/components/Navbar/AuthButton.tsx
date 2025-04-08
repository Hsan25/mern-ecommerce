"use client"
import Link from "next/link";
import { Button } from "../ui/button";

const AuthButton = () => {
  return (
    <>
      <div className="flex gap-1 items-center">
        <Button variant={"outline"} size={"xs"}>
          <Link className="text-sm" href={"/auth/login"}>
            Login
          </Link>
        </Button>
        <Button variant={"ghost"} size={"xs"}>
          <Link className="text-sm" href={"/auth/signup"}>
            SignUp
          </Link>
        </Button>
      </div>
    </>
  );
};

export default AuthButton;
