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

  private apiUrl: string = "http://localhost:8080/profile/"

  public getEmployers(page: number, skills: Skill[]): Observable<Profile[]> {
    const skillsQueryParam = JSON.stringify(skills);
    const queryParams = `?skills=${encodeURIComponent(skillsQueryParam)}&page=${page}&size=10`;
    return this.http.get<Profile[]>(`${this.apiUrl}get/employers${queryParams}`);
  }

}
