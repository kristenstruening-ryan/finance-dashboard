import { z } from 'zod';

export const assetUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  symbol: z.string().min(1, "Ticker symbol is required").max(10).toUpperCase(),
  amount: z.number().positive("Amount must be greater than 0"),
  purchasePrice: z.number().nonnegative("Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
});

export type AssetUpdateInput = z.infer<typeof assetUpdateSchema>;