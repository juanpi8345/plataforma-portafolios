import { Component } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { EmployeeService } from '../../../services/employee.service';
import { SkillService } from '../../../services/skill.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription, catchError } from 'rxjs';
import { Skill } from '../../../model/skill';
import { User } from '../../../model/user';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent {
  constructor(private authService: AuthService, private router: Router
    , private profileService: ProfileService, private skillService: SkillService
    , private fb: FormBuilder, private employeeService: EmployeeService) {
    this.user$ = this.authService.get().pipe(catchError(error => {
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error;
    }));
    this.skills$ = this.skillService.getSkills();
  }

  user$!: Observable<any>;

  skills$!: Observable<Skill[]>;
  addSkill: boolean = false;

  editOccupationSubscription: Subscription;
  editSearchingSubscription: Subscription;
  editDescriptionSubscription: Subscription;
  addSkillSubscription: Subscription;
  deleteSkillSubscription: Subscription;

  skill = new FormControl('Angular');

  role: string;

  ngOnInit() {
    this.role = this.authService.getUserRol();
    this.authService.get().subscribe(user=>{
      console.log(user);
    })
  }


  public editName(user: User): void {
    Swal.fire({
      title: 'Editar nombre',
      html: '<input type="text" (input)="getSkillsContaining()" id="modal-input" placeholder="Tu nuevo nombre aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;
        this.profileService.editName(inputValue).subscribe();
        user.profile.name = inputValue;
      }
    });
  }

  public editOccupation(user: User): void {
    Swal.fire({
      title: 'Editar ocupacion',
      html: '<input type="text" id="modal-input" placeholder="Tu nueva ocupacion aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;
        this.editOccupationSubscription = this.profileService.editOccupation(inputValue).subscribe();
        user.profile.occupations = inputValue;
      }
    });
  }


  public editDescription(user: User): void {
    Swal.fire({
      title: 'Editar descripcion',
      html: '<textarea type="text" id="modal-input" placeholder="Tu nueva descripcion aqui" rows="4" cols="50" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLTextAreaElement>document.getElementById('modal-input')).value;
        this.editDescriptionSubscription = this.profileService.editDescription(inputValue).subscribe();
        user.profile.description = inputValue;
      }
    });
  }

  public formSkill(): void {
    this.addSkill = true;
  }

  public closeFormSkill(): void {
    this.addSkill = false;
  }

  public saveSkill(event: Event, user: any): void {
    event.preventDefault();
    if (this.skill.valid) {
      Swal.fire({
        title: 'Agregar skill',
        html: '¿Estás seguro de que deseas agregar la skill?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8a2be2',
      }).then((result) => {
        if (result.isConfirmed) {
          this.addSkillSubscription = this.employeeService.addSkill(this.skill.value).subscribe((skill: Skill) => {
            if (!this.skillExists(skill.title, user))
              user.profile.skills.push(skill);
            this.closeFormSkill();
          })
        }
      });
    }
  }

  public deleteSkill(skillId: number, user: any) {
    Swal.fire({
      title: 'Eliminar skill',
      html: '¿Estás seguro de que deseas eliminar la skill?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8a2be2',
    }).then((result) => {
      if (result.isConfirmed) {
        user.profile.skills = user.profile.skills.filter(skill => skill.skillId !== skillId)
        this.deleteSkillSubscription = this.employeeService.deleteSkill(skillId).subscribe();
      };
    });
  }


  //Aux
  public skillExists(title: string, user: any) {
    for (let skill of user.profile.skills) {
      if (skill.title === title)
        return true;
    }
    return false;
  }


  ngOnDestroy() {
    if (this.addSkillSubscription)
      this.addSkillSubscription.unsubscribe();

    if (this.editOccupationSubscription)
      this.editOccupationSubscription.unsubscribe();

    if (this.editDescriptionSubscription)
      this.editDescriptionSubscription.unsubscribe();

    if (this.editSearchingSubscription)
      this.editSearchingSubscription.unsubscribe();

    if (this.deleteSkillSubscription)
      this.deleteSkillSubscription.unsubscribe();
  }
}
