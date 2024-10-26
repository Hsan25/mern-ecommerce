import { z } from "zod";
export const AddressSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).toLowerCase(),
  address: z.string().min(1, { message: "address is required" }),
  email: z.string().email(),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  notes: z.string().optional(),
});
