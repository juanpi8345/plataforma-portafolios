import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDTO } from '../model/user-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  private apiUrl : string = "http://localhost:8080/auth/";

  public registerUser(user:UserDTO):Observable<HttpResponse<String>>{
      return this.http.post<HttpResponse<String>>(this.apiUrl+ "register",user);
  }
}
