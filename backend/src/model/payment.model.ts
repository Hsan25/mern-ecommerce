import { PAYMENT_METHOD } from '../constants';
import mongoose, { Types } from 'mongoose';
const PaymentSchema = new mongoose.Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Types.ObjectId, ref: 'Order', required: true },
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
      default: 'waiting',
      enum: ['success', 'rejected', 'waiting confirmation'],
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Payment', PaymentSchema);
