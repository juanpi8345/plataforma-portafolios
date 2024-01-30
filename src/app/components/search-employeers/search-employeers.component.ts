import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Skill } from '../../model/skill';
import { SkillService } from '../../services/skill.service';
import { Profile } from '../../model/profile';
import { EmployerService } from '../../services/employer.service';

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
  employers$!: Observable<Profile[]>;
  searchList : Skill[] = [];

  page : number = 0;

  constructor(private skillService:SkillService, private employerService:EmployerService){
    this.skills$ = skillService.getSkills(); 
  }

  addSkill(skill : Skill, event:Event):void{
    console.log(skill)
    event.preventDefault();
    if(!this.skillExists(skill) && skill != null)
      this.searchList.push(skill);
    this.getEmployers(this.searchList);
  }

  removeSkill(skill:Skill):void{
    this.searchList = this.searchList.filter(item => item != skill);
  }

  skillExists(skill : Skill):boolean{
    return this.searchList.includes(skill);
  }

  getEmployers(searchList: Skill[]):void{
    this.employers$ = this.employerService.getEmployers(this.page,this.searchList);
    this.page++;
  }

}
