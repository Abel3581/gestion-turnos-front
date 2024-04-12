export interface UserPaymentResponse {
  name: string;
  lastname: string;
  title: string;
  username: string;
  country: string;
  specialty: string;
  itsVip: boolean;
  profile: any; // Dependiendo de la estructura del perfil del usuario
}
