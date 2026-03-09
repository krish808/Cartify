import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});
