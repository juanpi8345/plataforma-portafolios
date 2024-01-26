import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay } from 'rxjs';
import { UserDTO } from '../model/user-dto';
import { Login } from '../model/login';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  private apiUrl : string = "http://localhost:8080/auth/";

  public registerUser(user:UserDTO):Observable<HttpResponse<String>>{
      return this.http.post<HttpResponse<String>>(this.apiUrl+ "register",user);
  }

  public authenticate(login:Login):Observable<HttpResponse<String>>{
    return this.http.post<HttpResponse<String>>(this.apiUrl+ "login",login);
  }

  public get():Observable<any>{
    return this.http.get<User>(this.apiUrl + "get").pipe(delay(2000));
  }

  //localstorage
  
  public login(token:string):void{
    localStorage.setItem("token",token);
  }

  public setUser(user:User){
    localStorage.setItem("user",JSON.stringify(user));
  }

  public logout():void{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public isLoggedIn():boolean{
    let token = localStorage.getItem('token');
    return (token != null && token != undefined && token != '' )
  }

  public getUser(){
    let userStr = localStorage.getItem("user");
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.logout();
    }
  }

  public getUserRol():string{
    let user = this.getUser();
    return user.authorities[0].authority;
  }

  public getToken():string{
    return localStorage.getItem('token');
  }
}
