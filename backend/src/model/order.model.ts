import mongoose, { Schema, Types } from 'mongoose';
import Address from './address.model'; // Adjust the path according to your project structure
import { OrderStatus, PAYMENT_METHOD } from '../constants';
const ShippingSchema = new Schema({
  type: {
    type: String,
    enum: ['Regular', 'Economy'],
  },
  price: { type: Number, required: true },
});
// payment order schema
const PaymentSchema = new Schema(
  {
    method: {
      type: String,
      required: true,
      enum: [
        PAYMENT_METHOD.BankTransfer,
        PAYMENT_METHOD.Dana,
        PAYMENT_METHOD.Gopay,
      ],
    },
    status: {
      type: String,
      default: null,
      enum: ['waiting', 'failed', 'success'],
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
  },
  { _id: false },
);
const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: { type: [Types.ObjectId], required: true, ref: 'CartItems' },
    shippingAddress: { type: Address.schema, required: true },
    payment: PaymentSchema,
    status: {
      type: String,
      default: OrderStatus.Pending,
      enum: [
        OrderStatus.Pending,
        OrderStatus.Processing,
        OrderStatus.Shipped,
        OrderStatus.Delivered,
        OrderStatus.Cancelled,
      ],
    },
    taxPrice: { type: Number, required: true },
    shipping: { type: ShippingSchema, required: true },
    totalPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date, default: null },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1, createdAt: 1 });
export default mongoose.model('Order', OrderSchema);
