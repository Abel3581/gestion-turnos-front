import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageResponse } from '../models/response/message-response';
import { ImageResponse } from '../models/response/image-response';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private urlImage = `http://localhost:8080/images`;
  constructor(private http: HttpClient) { }

  public uploadImage(userId: number, file: File): Observable<MessageResponse>{
    const url = `${this.urlImage}/upload/${userId}`;
    const formData = new FormData();
    formData.append('file', file, file.name);
    // Encabezados para la solicitud
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
      // Opciones para la solicitud
      const options = { headers: headers };
    return this.http.put<MessageResponse>(url, formData, options);
  }

  public getImageByUserId(userId: number): Observable<ImageResponse>{
    const url = `${this.urlImage}/${userId}`;
    return this.http.get<ImageResponse>(url);
  }
}
