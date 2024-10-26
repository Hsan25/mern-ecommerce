import apiService from "./axios";

export const fetcher = async (url: string, pathData?: string) => {
  try {
    const res = await apiService.get(url);
    return pathData ? res.data.data[pathData] : res.data.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
