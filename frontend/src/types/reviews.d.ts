export interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: {
      id: string | null;
      url: string | null;
    };
  };
  rating: number;
  comment: string;
  product: string;
  createdAt: Date;
}
