
import { LocalDate } from "./local-date";
import { PatientResponse } from "./patient-response";

export interface TurnResponse {

  id: number;
  centerName: string;
  date: Date;
  hour: string;
  patientDni: string;
  shiftStatus: string;
  availability: boolean;
  patientResponse: PatientResponse;
}
