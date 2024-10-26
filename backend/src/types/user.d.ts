export type UserBody = {
  email: string;
  password: string;
  username: string;
};

export interface OptionUser {
  limit: number;
  page: number;
  search?: string;
}