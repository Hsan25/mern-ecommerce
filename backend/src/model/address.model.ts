import mongoose, { Types } from 'mongoose';

const AddressSchema = new mongoose.Schema(
  {
    user: { type: Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    notes: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model('Address', AddressSchema);
