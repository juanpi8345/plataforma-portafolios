import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Skill } from '../../../model/skill';
import { SkillService } from '../../../services/skill.service';
import { Profile } from '../../../model/profile';
import { EmployerService } from '../../../services/employer.service';
import { EmployeeService } from '../../../services/employee.service';
import { RouterLink } from '@angular/router';
import { Employer } from '../../../model/employer';

@Component({
  selector: 'app-search-employeers',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './search-employeers.component.html',
  styleUrl: './search-employeers.component.css'
})
export class SearchEmployeersComponent {

  skill = new FormControl('Angular');

  skills$!: Observable<Skill[]>;

  
  searchList : string[] = [];
 
  //to iterate and view a paginated template
  numbers : number[] = [];

  //total pages of the elements  
  totalPages : number;

  employers:Employer[];
  getTotalPagesSubscription : Subscription;

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
    this.numbers = [];
    this.getTotalPagesSubscription = this.employeeService.getEmployers(this.page,searchList).subscribe((data)=>{
      this.totalPages = data.totalPages;
      this.employers = data.content;
      this.fillNumbers();
    })
  }

  ngOnDestroy():void{
    if(this.getTotalPagesSubscription){
      this.getTotalPagesSubscription.unsubscribe();
    }
  }

  //aux
  //to iterate we need to fill the array numbers knowing the number of the total pages
  fillNumbers():void{
    for(let i = 1; i <= this.totalPages; i++){
      this.numbers.push(i);
    }
  }

  changePage(pageNumber:number):void{
      this.page = pageNumber;
      this.getEmployers(this.searchList);
  }




}
