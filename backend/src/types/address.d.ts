export interface AddressInterface {
  name: string;
  user?: Types.ObjectId;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
}
