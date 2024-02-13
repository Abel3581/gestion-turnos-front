import { LocalDate } from "./local-date";

export interface PatientPageResponse {
  id: number; // Replace with appropriate type if ID is not a number
  name: string;
  surname: string;
  healthInsurance: string;
  genre: string;
  affiliateNumber: string;
  dateOfBirth: LocalDate;
  cellphone: string;
  landline: string;
  nationality: string;
  province: string;
  address: string;
  profession: string;
  email: string;
  dni: string;
  plan: string;
  age: string;
}
