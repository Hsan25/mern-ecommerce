import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Profile",
};

const ProfileLayout = ({ children }: { children: ReactNode }) => {
  return children;
};
export default ProfileLayout;
