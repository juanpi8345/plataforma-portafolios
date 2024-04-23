import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { Observable, catchError, map } from 'rxjs';
import { EmployerService } from '../../../services/employer.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-view-employee',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view-employee.component.html',
  styleUrl: './view-employee.component.css'
})
export class ViewEmployeeComponent {

  constructor(private router: Router , private employerService:EmployerService,
    private route:ActivatedRoute, private profileService:ProfileService,
    private authService:AuthService, private employeeService:EmployeeService) {}

  profileId : number;
  employee$!: Observable<any>;
  image : string;
  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.profileId = this.route.snapshot.params['profileId'];
      this.employee$ = this.employerService.getEmployee(this.profileId).pipe(catchError(error => {
        this.authService.logout();
        this.router.navigate(['/login']);
        throw new Error;
        //Hay que agregar las imagenes de los proyectos
        //El get de profile seria muy grande si tambien recibe las imagenes
      }),map((emplyoee: any) => {
        emplyoee.projects.forEach(project => {
          this.employeeService.getProjectImage(project.projectId).subscribe(imageUrl => {
            project.image = imageUrl;
          });
        });
        return emplyoee;
      }));;
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
