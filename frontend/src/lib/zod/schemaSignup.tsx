import { z } from "zod";

const signupSchema = z.object({
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
  role: z.enum(["ADMIN", "USER"]).optional(), //for adminn
});

export default signupSchema;
