import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Observable, map } from 'rxjs';
import { EmployerService } from '../../../services/employer.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {

  constructor(private router: Router , private employerService:EmployerService,
    private route:ActivatedRoute, private profileService:ProfileService) {}

  profileId : number;
  employee$!: Observable<any>;
  image : string;
  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.profileId = this.route.snapshot.params['profileId'];
      this.employee$ = this.employerService.getEmployee(this.profileId);
      this.loadImage()
    })

  }

  loadImage(): void {
    this.profileService.getOtherProfileImage(this.profileId).pipe(
       map(blob => {
         return URL.createObjectURL(blob);
       })
     ).subscribe(image=>this.image = image);
   }

}
