import { UserPaymentResponse } from "./user-payment-response";

export interface VoucherResponse {
  id: number;
  idTransaccion: number;
  creationDateTime: string;
  approvalDateTime: string;
  description: string;
  statusDetail: string;
  currencyId: string;
  installments: number;
  transactionAmount: number;
  status: string;
  paymentTypeId: string;
  initPoint: string;
  user: UserPaymentResponse;
}
