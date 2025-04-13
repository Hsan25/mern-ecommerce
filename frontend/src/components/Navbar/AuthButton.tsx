"use client";
import Link from "next/link";
import { Button } from "../ui/button";

const postions = {
  center: "justify-center items-center",
  default: "items-center",
};

interface PropsAuthButton {
  position?: "center" | "default";
}
const AuthButton = ({ position = "default" }: PropsAuthButton) => {
  return (
    <>
      <div className={`flex gap-2 ${postions[position]}`}>
        <Button variant={"outline"} size={"sm"}>
          <Link className="text-sm" href={"/auth/login"}>
            Login
          </Link>
        </Button>
        <Button variant={"ghost"} size={"sm"}>
          <Link className="text-sm" href={"/auth/signup"}>
            SignUp
          </Link>
        </Button>
      </div>
    </>
  );
};

export default AuthButton;
