import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Profile } from '../../../model/profile';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { Skill } from '../../../model/skill';
import { SkillService } from '../../../services/skill.service';
import { FormBuilder, FormControl, FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Observable, Subscription, catchError } from 'rxjs';
import { UserDTO } from '../../../model/user-dto';
import { User } from '../../../model/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {

  constructor(private authService: AuthService, private router: Router
    , private employeeService: EmployeeService, private skillService: SkillService
    , private fb: FormBuilder) {
    this.user$ = this.authService.get().pipe(catchError(error=>{
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error;
    }));
    this.skills$ = this.skillService.getSkills();
  }

  user$!: Observable<User>;
  skills$!: Observable<Skill[]>;

  addSkill: boolean = false;

  editOccupationSubscription:Subscription;
  editDescriptionSubscription:Subscription;
  addSkillSubscription:Subscription;
  deleteSkillSubscription:Subscription;

  skill = new FormControl('Angular');

  public editName(user:User): void {
    Swal.fire({
      title: 'Editar nombre',
      html: '<input type="text" (input)="getSkillsContaining()" id="modal-input" placeholder="Tu nuevo nombre aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;
        this.employeeService.editName(inputValue).subscribe();
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
        this.editOccupationSubscription = this.employeeService.editOccupation(inputValue).subscribe();
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
        this.editDescriptionSubscription = this.employeeService.editDescription(inputValue).subscribe();
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

  public saveSkill(event: Event, user: User): void {
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
         this.addSkillSubscription =  this.skillService.addSkill(this.skill.value).subscribe((skill: Skill) => {
            if (!this.skillExists(skill.title, user))
              user.profile.skills.push(skill);
            this.closeFormSkill();
          })
        }
      });
    }
  }

  public deleteSkill(skillId: number, user: User) {
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
        this.deleteSkillSubscription = this.skillService.deleteSkill(skillId).subscribe();
      };
    });
  }

  // Aux
  public skillExists(title: string, user: User) {
    for (let skill of user.profile.skills) {
      if (skill.title === title)
        return true;
    }
    return false;
  }

  ngOnDestroy(){
    this.addSkillSubscription.unsubscribe();
    this.editOccupationSubscription.unsubscribe();
    this.editDescriptionSubscription.unsubscribe();
    this.deleteSkillSubscription.unsubscribe();
  }
}




