import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Profile } from '../../../model/profile';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { Skill } from '../../../model/skill';
import { SkillService } from '../../../services/skill.service';
import { FormBuilder, FormControl, FormControlName, FormsModule, ReactiveFormsModule } from '@angular/forms';



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
    , private fb: FormBuilder) { }

  profile: Profile = new Profile();
  skills: Skill[];
  addSkill: boolean = false;

  skill = new FormControl('Angular');

  ngOnInit(): void {
    this.authService.get().subscribe((response: any) => {
      this.profile = response.profile;
    }, responseErr => {
      if (responseErr.status === 403) {
        this.authService.logout();
        Swal.fire({
          icon: 'error',
          title: 'Sesion expirada',
          text: 'Por favor inicia sesion nuevamente',
          confirmButtonColor: '#8a2be2',
        });
        this.router.navigate(['login']);
      }
    })
    this.skillService.getSkills().subscribe((skills: Skill[]) => {
      this.skills = skills;
    })

  }


  public editName(): void {
    Swal.fire({
      title: 'Editar nombre',
      html: '<input type="text" (input)="getSkillsContaining()" [(ngModel)]="inputValue" id="modal-input" placeholder="Tu nuevo nombre aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;

        this.employeeService.editName(inputValue).subscribe(() => {
          this.profile.name = inputValue;
        }, err => {
          Swal.fire("Error al actualizar nombre", "Por favor revisa que no contenga caracteres especiales", "error");
        });
      }
    });
  }

  public editOccupation(): void {
    Swal.fire({
      title: 'Editar ocupacion',
      html: '<input type="text" id="modal-input" placeholder="Tu nueva ocupacion aqui" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLInputElement>document.getElementById('modal-input')).value;
        this.employeeService.editOccupation(inputValue).subscribe(() => {
          this.profile.occupations = inputValue;
        }, err => {
          Swal.fire("Error al actualizar ocupacion", "Por favor revisa que no contenga caracteres especiales", "error");
        });
      }
    });
  }


  public editDescription(): void {
    Swal.fire({
      title: 'Editar descripcion',
      html: '<textarea type="text" id="modal-input" placeholder="Tu nueva descripcion aqui" rows="4" cols="50" class="text-center rounded-md border border-color-gray p-2 w-full transition duration-500 focus:border-violet-800 focus:outline-none">',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const inputValue = (<HTMLTextAreaElement>document.getElementById('modal-input')).value;
        this.employeeService.editDescription(inputValue).subscribe(() => {
          this.profile.description = inputValue;
        }, err => {
          Swal.fire("Error al actualizar descripcion", "Por favor revisa que no contenga caracteres especiales y no sea demasiado extensa", "error");
        });
      }
    });
  }

  public formSkill(): void {
    this.addSkill = true;
  }

  public closeFormSkill(): void {
    this.addSkill = false;
  }

  public saveSkill(event: Event): void {
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
          this.skillService.addSkill(this.skill.value).subscribe((skill: Skill) => {
            if (!this.skillExists(skill.title))
              this.profile.skills.push(skill);
            this.closeFormSkill();
          })
        }
      });

    }
  }

  public deleteSkill(skillId: number) {
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
        this.profile.skills = this.profile.skills.filter(skill => skill.skillId !== skillId)
        this.skillService.deleteSkill(skillId).subscribe();
        
      };
    });
  }



  // Aux
  public skillExists(title: string) {
    for (let skill of this.profile.skills) {
      if (skill.title === title)
        return true;
    }
    return false;
  }

  // public getSkillById(id:number):Skill{
  //   for (let skill of this.profile.skills) {
  //     if (skill.skillId === id)
  //       return skill;
  //   }
  //   return null;
  // }

}




