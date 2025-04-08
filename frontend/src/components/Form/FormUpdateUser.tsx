"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import apiService from "@/lib/axios";
import { User } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import InputLabel from "@/components/InputLabel";
import SelectCustom from "@/components/SelectCustom";
import Loading from "../Loading";

interface Props {
  id: string;
}
interface EditBody {
  username: string;
  email: string;
  role?: string;
}

// dashboard user form admin
const FormUpdateUser = ({ id }: Props) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [file, setFile] = useState<Blob | MediaSource | null>(null);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const { push } = useRouter();
  const { data, isLoading: loadingData } = useSWR<User>(
    `/users/${id}`,
    async () => await fetcher(`/users/${id}`, "user")
  );

  const { register, handleSubmit, reset } = useForm<EditBody>({});
  const userSchema = z.object({
    username: z
      .string()
      .min(5, { message: "must contain at least 5 character(s)" }),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("Invalid Email"),
    role: z.enum(["ADMIN", "USER"]).optional(),
  });

  const onSubmit: SubmitHandler<EditBody> = async (data) => {
    try {
      setIsLoading(true);
      const safe = userSchema.parse({ ...data, role });
      const result = await apiService.put(
        `/users/${id}`,
        {
          user: safe,
          avatar: file || null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        description: "Update user Success... !!!",
      });
      reset();
      setError("");
      push("/dashboard/users");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFile(file);
      return;
    }
  };

  if (loadingData || !data) return <Loading />;
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        method="post"
        className="max-w-sm pt-8 mx-auto flex flex-col gap-3"
      >
        {error && <div className="text-red-600 my-2 text-xs">* {error}</div>}
        <InputLabel
          label={"username"}
          {...register("username", { required: true })}
          defaultValue={data.username}
        />
        <InputLabel
          label={"Email"}
          {...register("email", { required: true })}
          defaultValue={data.email}
        />

        <SelectCustom
          placeholder="Select a role"
          label="Role user"
          items={[
            { name: "USER", value: "USER" },
            { name: "ADMIN", value: "ADMIN" },
          ]}
          defaultValue={data.role}
          onValueChange={(val: string) => setRole(val as "ADMIN" | "USER")}
        />
        <div className="relative w-52 h-32 my-3 border-white border-2 mx-auto pt-3">
          <InputLabel
            label={"avatar"}
            type="file"
            placeholder="Avatar"
            onChange={handleChange}
            className="absolute w-full h-full block z-10 opacity-0 inset-0"
          />
          {file || data.avatar.url ? (
            <Image
              src={file ? URL.createObjectURL(file) : data.avatar.url || ""}
              alt="Avatar"
              fill={true}
            />
          ) : null}
          <p className="absolute -bottom-5 text-xs">
            image extension (jpg,jpeg,png)
          </p>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </>
  );
};

export default FormUpdateUser;
