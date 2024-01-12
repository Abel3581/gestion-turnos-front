import { PatientResponse } from "./patient-response";

export interface TurnResponse {

  startDate: Date;
  endDate: Date;
  patientResponse: PatientResponse;
}
