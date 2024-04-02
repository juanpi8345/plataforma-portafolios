import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile';
import { Skill } from '../model/skill';
import { Employee } from '../model/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = "http://localhost:8080/employer/"

  public getEmployees(page:number,skills:string[]):Observable<any>{
    const queryParams = `?skillsStr=${skills}&page=${page}&size=10`;
    return this.http.get<Profile[]>(`${this.apiUrl}get/employees${queryParams}`);
  }

  public getEmployee(profileId:number):Observable<Employee>{
    return this.http.get<Employee>(this.apiUrl+"get/employee/"+profileId);
  }

  public addSearchedSkill(newSkill : string):Observable<Skill>{
    return this.http.post<Skill>(this.apiUrl+"add/searchedSkill?title="+newSkill,null);
  }

  public editSearching(newSearching:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/searching?newSearching="+newSearching,null);
  }

  public deleteSearchedSkill(skillId:number):Observable<any>{
    return this.http.delete(this.apiUrl + "delete/skill/"+skillId);
  }


}
