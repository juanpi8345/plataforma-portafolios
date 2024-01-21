import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../model/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private http:HttpClient) { }

  private apiUrl : string = "http://localhost:8080/skills/";

  public getSkills():Observable<Skill[]>{
    return this.http.get<Skill[]>(this.apiUrl + "getAll");
  }

  public addSkill(title:string):Observable<Skill>{
    return this.http.post<Skill>(this.apiUrl+"add?title="+title,null);
  }

  public deleteSkill(skillId:number):Observable<any>{
    return this.http.delete<any>(this.apiUrl + "delete/"+skillId);
  }
}
