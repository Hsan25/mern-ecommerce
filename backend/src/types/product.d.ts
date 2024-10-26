export interface ProductBody {
  name: string;
  stock: number;
  description: string;
  price: number;
  categories: string[];
  ratings: number;
  images: string[];
  seller: string;
}
export type SortProduct = "priceLowToHigh" | "priceHighToLow" | "trending";
export interface OptionProduct {
  limit: number;
  page: number;
  search?: string;
  sortBy?: SortProduct;
  detail: boolean;
}
