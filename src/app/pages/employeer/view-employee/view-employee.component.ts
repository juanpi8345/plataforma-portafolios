import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Observable } from 'rxjs';
import { EmployerService } from '../../../services/employer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {

  constructor(private router: Router , private employerService:EmployerService,
    private route:ActivatedRoute) {}

  profileId : number;
  employee$!: Observable<any>;

  ngOnInit() {
    this.profileId = this.route.snapshot.params['profileId'];
    this.employee$ = this.employerService.getEmployee(this.profileId);
  }

}
