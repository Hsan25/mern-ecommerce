export interface PaymentMethodType {
  method: string;
  account: {
    bank?: string;
    nomor: string;
    name: string;
  };
}