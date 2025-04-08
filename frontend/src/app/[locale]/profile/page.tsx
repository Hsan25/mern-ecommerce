"use client";
import AlertDialog from "@/components/AlertDialog";
import ChangeLanguage from "@/components/ChangeLanguange";
import InputLabel from "@/components/InputLabel";
import Loading from "@/components/Loading";
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
    .max(15, "The maximum username characters is 15"),
  email: z.string().email().optional(),
});

type Profile = z.infer<typeof ProfileSchema>;
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, getValues, setValue } = useForm<Profile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { back } = useRouter();
  const [file, setFile] = useState<MediaSource | Blob | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false); //dialog logout
  const onSubmit = async (data: Profile) => {
    setIsLoading(true);
    try {
      const parse = ProfileSchema.parse(data);
      const res = await apiService.put(
        `/users/${user?._id}`,
        {
          user: parse,
          avatar: file || null,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast({
        title: "notif",
        description: "success update user",
      });
      setIsEdit(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0].path[0] + ": " + error.issues[0].message);
      } else {
        setError(error.response.data.msg);
        toast({
          title: "notif",
          description: "failed update user",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Loading />;
  return (
    <>
      <AlertDialog
        onContinue={logout}
        description="apakah anda yakin ingin logout?"
        open={open}
        onCancel={() => setOpen(false)}
      />
      <div className="w-full px-2 md:px-10 p-4 max-w-lg border-rounded min-h-96 mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" flex pb-3 flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-lg">Profile User</div>
              <ChangeLanguage />
              <Button
                size={"sm"}
                onClick={() => setOpen(!open)}
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
                {user.avatar.url || file ? (
                  <Image
                    src={
                      file ? URL.createObjectURL(file) : user.avatar.url || ""
                    }
                    alt={"avatar user"}
                    fill
                  />
                ) : (
                  <p className="text-center text-sm">no avatar</p>
                )}
              </div>
              {isEdit ? (
                <Button
                  className="relative my-2 max-w-32 text-sm block"
                  size={"sm"}
                >
                  {user.avatar.url || file ? "Change Avatar" : "Add Avatar"}
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
