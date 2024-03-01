import { Component } from '@angular/core';
import { User } from '../../../model/user';
import Swal from 'sweetalert2';
import { Observable, Subscription, catchError } from 'rxjs';
import { Skill } from '../../../model/skill';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import { SkillService } from '../../../services/skill.service';
import { EmployerService } from '../../../services/employer.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent {

    constructor(private authService: AuthService, private router: Router
    , private profileService: ProfileService, private skillService: SkillService
    , private fb: FormBuilder, private employerService: EmployerService) {
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

  editSearchingSubscription: Subscription;
  editDescriptionSubscription: Subscription;
  editOccupationSubscription: Subscription;
  addSkillSubscription: Subscription;
  deleteSkillSubscription: Subscription;

  skill = new FormControl('Angular');

  role: string;

  ngOnInit() {
    this.role = this.authService.getUserRol();
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


  public editSearching(user: any): void {
    Swal.fire({
      title: 'Editar busqueda',
      html: '<input type="text" id="modal-input" placeholder="Tu nueva busqueda aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;
        this.editSearchingSubscription = this.employerService.editSearching(inputValue).subscribe();
        user.profile.searching = inputValue;
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
  public formSkill(): void {
    this.addSkill = true;
  }

  public closeFormSkill(): void {
    this.addSkill = false;
  }


  public saveSearchedSkill(event: Event, user: any): void {
    event.preventDefault();
    if (this.skill.valid) {
      Swal.fire({
        title: 'Agregar skill',
        html: '¿Estás seguro de que deseas agregar la skill a la busqueda?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8a2be2',
      }).then((result) => {
        if (result.isConfirmed) {
          this.addSkillSubscription = this.employerService.addSearchedSkill(this.skill.value).subscribe((skill: Skill) => {
            if (!this.skillExists(skill.title, user))
              user.profile.searchedSkills.push(skill);
            this.closeFormSkill();
          })
        }
      });
    }
  }


  public deleteSearchedSkill(skillId: number, user: any) {
    Swal.fire({
      title: 'Eliminar skill de la busqueda',
      html: '¿Estás seguro de que deseas eliminar la skill?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8a2be2',
    }).then((result) => {
      if (result.isConfirmed) {
        user.profile.searchedSkills = user.profile.searchedSkills.filter(skill => skill.skillId !== skillId)
        this.deleteSkillSubscription = this.employerService.deleteSearchedSkill(skillId).subscribe();
      };
    });
  }


  public skillExists(title: string, user: any) {
    for (let skill of user.profile.searchedSkills) {
      if (skill.title === title)
        return true;
    }
    return false;
  }

  ngOnDestroy() {
    if (this.addSkillSubscription)
      this.addSkillSubscription.unsubscribe();

    if (this.editDescriptionSubscription)
      this.editDescriptionSubscription.unsubscribe();

    if (this.editSearchingSubscription)
      this.editSearchingSubscription.unsubscribe();

    if (this.deleteSkillSubscription)
      this.deleteSkillSubscription.unsubscribe();
  }

}
