import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
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
    return this.http.post<Skill>(this.apiUrl+"add/skill?title="+title,null);
  }

  public addProject(project:Project):Observable<any>{
    return this.http.post<Project>(this.apiUrl+"add/project",project);
  }

  public getProjectImage(projectId:number):Observable<string>{
    return this.http.get(this.apiUrl+"get/project/"+projectId+"/image",{ responseType: 'blob' })
                        .pipe(map(blob=>{
                            if(blob.size > 0){
                              return URL.createObjectURL(blob);
                            }
                          return null;
                            
                          
                        }));
  }

  public uploadProjectImage(file:File,projectId:number):Observable<any>{
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl+ "project/" + projectId+"/add/image?file=",formData);
  }

  public deleteProjectImage(projectId:number):Observable<any>{
    return this.http.delete(this.apiUrl+ "delete/project/"+projectId+"/image");
  }

  public deleteProject(projectId:number):Observable<any>{
    return this.http.delete(this.apiUrl+ "delete/project/"+projectId);
  }

  public deleteSkill(skillId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + "delete/skill/"+skillId);
  }


  
}
