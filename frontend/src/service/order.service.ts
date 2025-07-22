import apiService from "@/lib/axios";

import { NewOrder } from "@/types/order";

export const createOrder = async (body: NewOrder) => {
  try {
    const res = await apiService.post(`/orders`, {
      ...body,
      shippingAddress: body.address,
    });

    const data = res.data;

    return data.data as { id: string };
  } catch (error) {
    console.error(error);

    throw new Error("Failed create order");
  }
};
