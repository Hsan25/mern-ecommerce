export interface ReviewBody {
  user: string;
  comment: string;
  rating: number;
  product?: any;
}
