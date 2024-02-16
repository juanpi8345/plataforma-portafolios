import { Component } from '@angular/core';
import { SkillService } from '../../../services/skill.service';
import { Observable, Subscription, delay } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmployerService } from '../../../services/employer.service';
import { Skill } from '../../../model/skill';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../model/employee';

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

  searchList : string[] = [];

  //to iterate and view a paginated template
  numbers : number[] = [];

  //total pages of the elements  
  totalPages : number;

  employees:Employee[];
  getTotalPagesSubscription : Subscription;

  page : number = 0;

  constructor(private skillService:SkillService, private employerService:EmployerService){
    this.skills$ = skillService.getSkills(); 
  }

  addSkill(skill : string, event:Event):void{
    event.preventDefault();
    if(!this.skillExists(skill) && skill != null)
      this.searchList.push(skill);
    this.getEmployees(this.searchList);
  }

  removeSkill(skill:string):void{
    this.searchList = this.searchList.filter(item => item != skill);
    this.getEmployees(this.searchList);
  }

  skillExists(skill : string):boolean{
    return this.searchList.includes(skill);
  }

  getEmployees(searchList: string[]):void{
    this.numbers = [];
    this.getTotalPagesSubscription = this.employerService.getEmployees(this.page,searchList).subscribe((data)=>{
      this.totalPages = data.totalPages;
      this.employees = data.content;
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
      this.getEmployees(this.searchList);
  }

 
}
