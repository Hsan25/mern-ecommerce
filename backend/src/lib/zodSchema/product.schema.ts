import { z } from "zod";

export const schemaProduct = z.object({
  name: z.string().min(5).max(100),
  stock: z.number().min(1),
  // description: z.string().min(10),
  price: z.number().min(1),
  categories: z.array(z.string()),
  ratings: z.number().min(1),
  // images: z.array(z.string()).optional(),
  seller: z.string(),
});
