export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  product: string;
  createdAt: Date;
}
