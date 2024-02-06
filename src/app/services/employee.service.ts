import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../model/skill';
import { Profile } from '../model/profile';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http:HttpClient) { }

  private apiUrl : string  = "http://localhost:8080/employee/"

  public getEmployers(page: number, skills: string[]): Observable<any> {
    const queryParams = `?skillsStr=${skills}&page=${page}&size=10`;
    return this.http.get<Profile[]>(`${this.apiUrl}get/employers${queryParams}`);
  }

  public editOccupation(occupations:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/occupation?occupations="+occupations,null);
  }

  public addSkill(title:string):Observable<Skill>{
    return this.http.post<Skill>(this.apiUrl+"addSkill?title="+title,null);
  }

  public deleteSkill(skillId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + "deleteSkill/"+skillId);
  }


  
}
