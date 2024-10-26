import { z } from "zod";
export const schemaAddress = z.object({
  user: z.string(),
  name: z.string().min(4).max(40),
  email: z.string().email(),
  address: z.string().min(10).max(200),
  city: z.string().min(3).max(40),
  state: z.string(),
  zipCode: z.string().min(6).max(8),
  country: z.string(),
  phoneNumber: z.string().min(11).max(13),
  notes: z.string().max(200).optional(),
});
