import { UserPaymentResponse } from "./user-payment-response";

export interface PaymentResponse {
  id: number;
  paymentStatus: string;
  total: number;
  dateCreated: string;
  lastUpdate: string;
  orderReferenceExternal: string;
  preferenceIdPaymentMPago: string;
  user: UserPaymentResponse;
}
