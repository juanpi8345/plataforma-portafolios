import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) { }

  private employeeApiUrl : string  = "http://localhost:8080/profile/"

  uploadEmployeePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.employeeApiUrl + "add/image?image=" + formData,null);
  }

  getEmployeePicture(): Observable<any> {
    return this.http.get<any>(this.employeeApiUrl + "get/image");
  }
}


