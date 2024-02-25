import { PatientPageResponse } from "./patient-page-response";

export interface ClinicHistoryResponse {
  id: number;
  centerName: string;
  localDate: string;
  reasonForConsultation: string;
  background: string;
  physicalExam: string;
  complementaryStudies: string;
  observations: string;
  patientResponse: PatientPageResponse;

}
