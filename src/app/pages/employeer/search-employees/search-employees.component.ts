import { Component } from '@angular/core';
import { SkillService } from '../../../services/skill.service';
import { Observable } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmployerService } from '../../../services/employer.service';
import { Skill } from '../../../model/skill';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-employees',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './search-employees.component.html',
  styleUrl: './search-employees.component.css'
})
export class SearchEmployeesComponent {

  skill = new FormControl();

  skills$!: Observable<Skill[]>;
  employees$!: Observable<any>;
  searchList : string[] = [];

  page : number = 0;

  constructor(private skillService:SkillService, private employerService:EmployerService){
    this.skills$ = skillService.getSkills(); 
  }

  addSkill(skill : string, event:Event):void{
    event.preventDefault();
    if(!this.skillExists(skill) && skill != null)
      this.searchList.push(skill);
    this.getEmployers(this.searchList);
  }

  removeSkill(skill:string):void{
    this.searchList = this.searchList.filter(item => item != skill);
    this.getEmployers(this.searchList);
  }

  skillExists(skill : string):boolean{
    return this.searchList.includes(skill);
  }

  getEmployers(searchList: string[]):void{
    this.employees$ = this.employerService.getEmployees(this.page,searchList);
  }


}
