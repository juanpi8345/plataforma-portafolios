import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  private apiUrl : string  = "http://localhost:8080/profile/"

  public editName(name:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/name?name="+name,null);
  }

  public editOccupation(occupations:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/occupation?occupations="+occupations,null);
  }

  public editDescription(description:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/description?description="+description,null);
  }
}
