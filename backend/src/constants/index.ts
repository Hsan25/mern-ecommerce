export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum LoginProvider {
  Email = 'Email',
  Google = 'Google',
}
export enum MERCHANT_STATUS {
  Rejected = 'Rejected',
  Approved = 'Approved',
  Waiting_Approval = 'Waiting Approval',
}
export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Not_processed = 'Not processed',
}

export enum REVIEW_STATUS {
  Rejected = 'Rejected',
  Approved = 'Approved',
  Waiting_Approval = 'Waiting Approval',
}

export enum PAYMENT_METHOD {
  CashOnDelivery = 'Cash On Delivery',
  BankTransfer = 'Bank Transfer',
  Dana = 'Dana',
  Gopay = 'Go-Pay',
}

