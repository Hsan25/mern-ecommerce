import OrderController from '@controller/order.controller';
import express from 'express';
import { verifyAdmin } from 'middlewares/verifyAdmin';
import { verifyUser } from 'middlewares/verifyUser';
const router = express.Router();

router.get('/', verifyAdmin, OrderController.getOrders);
router.get('/:id', verifyAdmin, OrderController.getOrderById);
router.get('/user/:user', verifyUser, OrderController.getOrderByUser);
router.post('/', verifyUser, OrderController.createNewOrder);
router.put('/:orderId', verifyUser, OrderController.updateOrder);
export default router;
