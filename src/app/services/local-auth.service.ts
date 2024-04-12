import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LocalAuthService {

  private readonly TOKEN_LOGIN = 'AuthToken';
  private readonly ROL_USER = 'RolUser';
  private readonly EMAILUSER = 'EmailUser';
  private readonly NAME = 'Name';
  private readonly SURNAME = 'Surname';
  private readonly USER_ID = 'UserId';
  private readonly PROFILE_ID = 'ProfileId'

  constructor(private router: Router, private authService: AuthService) { }

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_LOGIN, token);
  }
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_LOGIN);
  }
  public setRole(rol: string): void{
    localStorage.setItem(this.ROL_USER, rol);
  }
  public getRole(): string | null {
    return localStorage.getItem(this.ROL_USER);
  }
  public setEmail(email: string): void {
    localStorage.setItem(this.EMAILUSER, email);
  }
  public getEmail(): string | null {
    return localStorage.getItem(this.EMAILUSER);
  }
  public setName(name: string):void{
    localStorage.setItem(this.NAME, name);
  }
  public getName(): string | null {
    return localStorage.getItem(this.NAME);
  }
  public setSurname(surname: string):void{
    localStorage.setItem(this.SURNAME, surname);
  }
  public getSurname(): string | null {
    return localStorage.getItem(this.SURNAME);
  }
  public logOut(): void {
    localStorage.removeItem(this.TOKEN_LOGIN);
  }
  public isLoggued(): boolean {
    return this.getToken() !== null;
  }
  public setUserId(userId: number): void {
    localStorage.setItem(this.USER_ID, userId.toString());
  }
  public getUserId(): number | null {
    const userIdString = localStorage.getItem(this.USER_ID);
    return userIdString ? parseInt(userIdString, 10) : null;
  }
  public setProfileId(profileId: number): void {
    localStorage.setItem(this.PROFILE_ID, profileId.toString());
  }
  public getProfileId(): number | null {
    const profileIdString = localStorage.getItem(this.PROFILE_ID);
    return profileIdString ? parseInt(profileIdString, 10) : null;
  }



}
