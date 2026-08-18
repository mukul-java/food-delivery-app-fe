export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED" | "SUCCESS" | "CREATED" | "EXPIRED";
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "UPI" | "NET_BANKING" | "WALLET" | "CASH";
export type PaymentGateway = "STRIPE" | "PAYPAL" | "RAZORPAY";
export type PaymentCurrency = "USD" | "EUR" | "INR" | "GBP";

export interface CreditCardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  securityCode: string;
}

export interface PaymentRequest {
  orderId: string;
  userId: string | number;
  amount: number;
  currency?: PaymentCurrency;
  paymentMethod: PaymentMethod;
  gateway?: PaymentGateway;
  creditCard?: CreditCardDetails;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  userId: string | number;
  amount: number;
  currency?: PaymentCurrency;
  paymentMethod: PaymentMethod;
  gateway?: PaymentGateway;
  paymentStatus: PaymentStatus;
  status?: PaymentStatus;
  transactionTimestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}
