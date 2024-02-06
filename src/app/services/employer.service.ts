import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../model/profile';
import { Skill } from '../model/skill';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {

  constructor(private http: HttpClient) { }

  private apiUrl: string = "http://localhost:8080/employer/"

  public addSearchedSkill(newSkill : string):Observable<Skill>{
    return this.http.post<Skill>(this.apiUrl+"add/searchedSkill?title="+newSkill,null);
  }

  public editSearching(newSearching:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/searching?newSearching="+newSearching,null);
  }

  public deleteSearchedSkill(skillId:number):Observable<any>{
    return this.http.delete(this.apiUrl + "deleteSkill/"+skillId);
  }


}
