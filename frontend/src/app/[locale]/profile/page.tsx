"use client";
// import { logout } from "@/action";
import InputLabel from "@/components/InputLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/authContext";
import apiService from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProfileSchema = z.object({
  username: z
    .string()
    .min(5, "min characters 5")
    .max(20, "The maximum username characters is 20"),
  email: z.string().email().optional(),
});

type Profile = z.infer<typeof ProfileSchema>;
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { refresh } = useRouter();
  const { register, handleSubmit, getValues, setValue, control } =
    useForm<Profile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [file, setFile] = useState<MediaSource | Blob | undefined>(undefined);
  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      setIsLoading(false);
      const res = await apiService.put(
        `/users/${user?._id}`,
        {
          user: data,
          avatar: file || null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status == 200) {
        toast({
          title: "notif",
          description: "success update user",
        });
        setIsEdit(false);
        refresh();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].path[0] + ": " + error.issues[0].message);
      } else {
        toast({
          title: "notif",
          description: "failed update user",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { back } = useRouter();
  if (!user) return <p>Loading...</p>;
  return (
    <>
      <div className="w-full px-2 md:px-10 p-4 max-w-lg border-rounded min-h-96 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex pb-3 flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-lg">Profile User</div>
              <Button
                size={"sm"}
                onClick={() => logout()}
                variant={"destructive"}
              >
                Logout
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm my-4">* {error}</p>}
            <InputLabel
              {...register("username", { required: true })}
              disabled={!isEdit}
              label="username"
              onChange={(e) => {
                if (
                  e.target.value == user.username &&
                  getValues("email") == user.email &&
                  !file
                ) {
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              defaultValue={user?.username}
            />
            <InputLabel
              {...register("email", { required: true })}
              disabled={!isEdit}
              label="email"
              onChange={(e) => {
                if (
                  e.target.value == user.email &&
                  getValues("username") == user.username &&
                  !file
                ) {
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              defaultValue={user?.email}
            />
            <div className="mx-auto my-3">
              <div className="text-center">Avatar</div>
              <div className="relative w-32 h-32 border-rounded">
                {user.avatar || file ? (
                  <Image
                    src={file ? URL.createObjectURL(file) : user.avatar || ""}
                    alt={"avatar user"}
                    fill
                  />
                ) : <p className="text-center text-sm">no avatar</p>}
              </div>
              {isEdit ? (
                <Button
                  className="relative my-2 max-w-32 text-sm block"
                  size={"sm"}
                >
                  {user.avatar || file ? "Change Avatar" : "Add Avatar"}
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        setFile(e.target.files[0]);
                        setIsEditing(true);
                      }
                    }}
                    className="z-40 w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                  />
                </Button>
              ) : null}
            </div>
          </div>
          <div className=" flex justify-between items-center">
            <Button
              variant={isEdit ? "destructive" : "default"}
              size={"sm"}
              type="button"
              onClick={() =>
                isEdit
                  ? (() => {
                      setIsEdit(false);
                      setValue("email", user.email);
                      setValue("username", user.username);
                      setFile(undefined);
                    })()
                  : back()
              }
            >
              {isEdit ? "Cancel" : "Back"}
            </Button>

            {isEdit ? (
              <Button size={"sm"} disabled={!isEditing} type="submit">
                {isLoading ? "Saving..." : "Save"}
              </Button>
            ) : (
              <Button
                size={"sm"}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEdit(true);
                }}
                type="button"
              >
                Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
