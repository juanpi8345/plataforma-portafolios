import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  private apiUrl : string  = "http://localhost:8080/profile/"

  public getProfile(profileId:number):Observable<any>{
    return this.http.get(this.apiUrl+"get/"+profileId);
  }

  public editName(name:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/name?name="+name,null);
  }

  public editDescription(description:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/description?description="+description,null);
  }

  public editOccupation(occupations:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/occupation?occupations="+occupations,null);
  }


}
