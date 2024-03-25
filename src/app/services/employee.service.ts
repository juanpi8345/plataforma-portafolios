import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../model/skill';
import { Profile } from '../model/profile';
import { Employee } from '../model/employee';
import { Employer } from '../model/employer';
import { Project } from '../model/project';

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

  public getEmployer(profileId:number):Observable<Employer>{
    return this.http.get<Employer>(this.apiUrl+"get/employer/"+profileId);
  }

  public addSkill(title:string):Observable<Skill>{
    return this.http.post<Skill>(this.apiUrl+"addSkill?title="+title,null);
  }

  public addProject(project:Project):Observable<any>{
    return this.http.post<Project>(this.apiUrl+"addProject",project);
  }

  public deleteProject(projectId:number):Observable<any>{
    return this.http.delete(this.apiUrl+ "deleteProject/"+projectId);
  }

  public deleteSkill(skillId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + "deleteSkill/"+skillId);
  }


  
}
