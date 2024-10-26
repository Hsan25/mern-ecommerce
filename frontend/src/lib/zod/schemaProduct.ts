import { z } from "zod";

export const schemaProduct = z.object({
  name: z.string().min(5).max(100),
  stock: z.number().min(1),
  description: z.string(),
  price: z.number().min(1),
  ratings: z.number().min(1).optional(),
  seller: z.string(),
});