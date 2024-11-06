import {
  addItemCart,
  deleteItemCart,
  getCartById,
  getCartByUserId,
  getCarts,
  updateItemCart,
} from "@service/cart.service";
import { ObjectId } from "@utils/index";
import response from "@utils/response";
import { Request, Response } from "express";
import { Types } from "mongoose";
const CartController = {
  getAllCart: async (req: Request, res: Response) => {
    try {
      const carts = await getCarts();
      response(res, 200, "success get cart", {
        carts,
      });
    } catch (error) {
      console.log(error);
      response(res, 400, "failed get cart");
    }
  },
  getCartById: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const cart = await getCartById(ObjectId(id));
      response(res, 200, "success fetch cart", {
        cart,
      });
    } catch (error: any) {
      console.log(error);
      response(res, 400, error.message);
    }
  },
  getCartByUserId: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const cart = await getCartByUserId(ObjectId(id));
      response(res, 200, "success fetch cart", {
        cart,
      });
    } catch (error: any) {
      console.log(error);
      response(res, 400, error.message);
    }
  },
  addItemCart: async (req: Request, res: Response) => {
    const body: { product: string } = req.body;
    const user = req.user;
    if (!user) return res.sendStatus(401).end();
    try {
      const cart = await addItemCart(
        user?.id,
        new Types.ObjectId(body.product),
      );
      response(res, 201, "success add cart");
    } catch (error: any) {
      console.log(error);
      response(res, 400, error.message);
    }
  },
  updateItemCart: async (req: Request, res: Response) => {
    const { item_cart_id } = req.params;
    const body: { quantity: number; status?: any } = req.body;
    const user = req.user;
    if (Number(body.quantity) < 1)
      return response(res, 400, "Quantity tidak boleh kosong");
    if (!body.quantity) return response(res, 400, "quantity required");
    try {
      const cart = await updateItemCart(ObjectId(item_cart_id), body);
      if (!cart) throw new Error("Failed update item cart");
      response(res, 200, "success update item cart");
    } catch (error: any) {
      console.log(error);
      response(res, 400, error.message);
    }
  },
  deleteItemCart: async (req: Request, res: Response) => {
    const { userId, item_cart_id } = req.params;
    const user = req.user;
    if (!user) return res.sendStatus(401).end();
    try {
      const cart = await deleteItemCart(
        user.id,
        new Types.ObjectId(item_cart_id),
      );
      response(res, 200, "success delete item cart", {
        cart,
      });
    } catch (error: any) {
      console.log(error);

      response(res, 400, error.message);
    }
  },
};
export default CartController;
