import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Skill } from '../../model/skill';
import { SkillService } from '../../services/skill.service';
import { Profile } from '../../model/profile';
import { EmployerService } from '../../services/employer.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-search-employeers',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './search-employeers.component.html',
  styleUrl: './search-employeers.component.css'
})
export class SearchEmployeersComponent {

  skill = new FormControl();

  skills$!: Observable<Skill[]>;
  employers$!: Observable<any>;
  searchList : string[] = [];

  page : number = 0;

  constructor(private skillService:SkillService, private employeeService:EmployeeService){
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
    this.employers$ = this.employeeService.getEmployers(this.page,searchList);
  }


}
