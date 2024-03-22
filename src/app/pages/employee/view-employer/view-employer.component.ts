import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, catchError, map } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-employer',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view-employer.component.html',
  styleUrl: './view-employer.component.css'
})
export class ViewEmployerComponent {

  constructor(private router: Router , private employeeService:EmployeeService,
    private route:ActivatedRoute, private profileService:ProfileService) {}

  profileId : number;
  employer$!: Observable<any>;
  image : string;

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.profileId = this.route.snapshot.params['profileId'];
      this.employer$ = this.employeeService.getEmployer(this.profileId);
      this.loadImage();
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
