import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { EmployeeService } from '../../../services/employee.service';
import { SkillService } from '../../../services/skill.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { Skill } from '../../../model/skill';
import { User } from '../../../model/user';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AddProjectComponent } from '../../../components/add-project/add-project.component';
import { Project } from '../../../model/project';
import { EditProjectComponent } from '../../../components/edit-project/edit-project.component';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, AddProjectComponent,EditProjectComponent],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent {
  editProjectSubscription: Subscription;
  constructor(private authService: AuthService, private router: Router
    , private profileService: ProfileService, private skillService: SkillService
    , private employeeService: EmployeeService) {
    this.getCurrentUser();
    this.skills$ = this.skillService.getSkills();
    this.loadImage();
  }
  user$!: Observable<any>;

  skills$!: Observable<Skill[]>;
  addSkill: boolean = false;
  profileImage$!: Observable<any>;

  editOccupationSubscription: Subscription;
  editSearchingSubscription: Subscription;
  editDescriptionSubscription: Subscription;
  addSkillSubscription: Subscription;
  deleteSkillSubscription: Subscription;
  deleteProjectSubscription: Subscription;

  skill = new FormControl('Angular');

  role: string;
  imageUrl: string;

  selectedFile: File;
  projectSelectedFile: File;

  openedModal: boolean = false;
  editProject : boolean = false;


  ngOnInit() {
    this.role = this.authService.getUserRol();
   
  }

  getCurrentUser() {
    this.user$ = this.authService.get().pipe(catchError(error => {
      this.authService.logout();
      this.router.navigate(['/login']);
      throw new Error;
      //Hay que agregar las imagenes de los proyectos
      //El get de profile seria muy grande si tambien recibe las imagenes
    }),map((user: any) => {
      user.profile.projects.forEach(project => {
        this.employeeService.getProjectImage(project.projectId).subscribe(imageUrl => {
          project.image = imageUrl;
        });
      });
      return user;
    }));
  }


  toggleModal() {
    this.openedModal = !this.openedModal;
  }



  editName(user: User): void {
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

  editOccupation(user: User): void {
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

  editDescription(user: User): void {
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

  formSkill(): void {
    this.addSkill = true;
  }

  closeFormSkill(): void {
    this.addSkill = false;
  }

  deleteProfilePhoto(){
    this.profileService.deleteImage().subscribe(()=>{
      this.loadImage();
    },err=>{Swal.fire("Error","Error al eliminar la imagen","error")})
  }

  saveSkill(event: Event, user: any): void {
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

  deleteSkill(skillId: number, user: any) {
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

  deleteProject(projectId: number, user: any) {
    Swal.fire({
      title: 'Eliminar proyecto',
      html: '¿Estás seguro de que deseas eliminar el proyecto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#8a2be2',
    }).then((result) => {
      if (result.isConfirmed) {
        user.profile.projects = user.profile.projects.filter(project => project.projectId !== projectId)
        this.deleteProjectSubscription = this.employeeService.deleteProject(projectId).subscribe();
      };
    });
  }

  toggleEditProject(){
    this.editProject = !this.editProject;
  }

  //Output
  receiveAddedProject(project:Project) {
    //Close modal after the user add a project
    this.openedModal = false;
    
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.onUpload();
  }

  onFileProjectSelected(event, project:Project) {
    this.projectSelectedFile = <File>event.target.files[0];
    this.onUploadImageProject(project);
  }

  loadImage(): void {
    this.profileImage$ = this.profileService.getImage().pipe(
      map(blob => {
        return URL.createObjectURL(blob);
      })
    );
  }

  // loadProjectImage(projectId:number): void {
  //   this.projectImage$ = this.employeeService.getProjectImage(projectId).pipe(
  //     map(blob => {
  //       return URL.createObjectURL(blob);
  //     })
  //   );;
    
  // }


  onUpload() {
    this.profileService.uploadImage(this.selectedFile).subscribe(() => {
      this.loadImage();
    },err=>{
      Swal.fire("Error","Error al subir la imagen","error")
    });
  }

  onUploadImageProject(project:Project){
    this.employeeService.uploadProjectImage(this.projectSelectedFile,project.projectId).subscribe(()=>{
         this.employeeService.getProjectImage(project.projectId).subscribe(data=>{
          project.image = data;
        })
    },err=>{
      Swal.fire("Imagen demasiado grande","La imagen es demasiado grande y/o pesada","error")
    })
  }

  deleteProjectImage(project:Project){
    this.employeeService.deleteProjectImage(project.projectId).subscribe(()=>{
      this.employeeService.getProjectImage(project.projectId).subscribe(data=>{
        project.image = data;
      })
    },err=>{Swal.fire("Error al eliminar la imagen","Ocurrio un error al intentar eliminar la imagen","error")});
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

    if (this.deleteProjectSubscription)
      this.deleteProjectSubscription.unsubscribe();
  }


  //Aux
  public skillExists(title: string, user: any) {
    for (let skill of user.profile.skills) {
      if (skill.title === title)
        return true;
    }
    return false;
  }

}
