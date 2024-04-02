import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import { Project } from '../../model/project';
import { User } from '../../model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent {
  constructor(private fb:FormBuilder, private datePipe:DatePipe,
    private employeeService:EmployeeService
    ,private authService:AuthService){
    
  }
  
  selectedFile: File;
  image : string;
  currentDate : string;
  startDate:string;
  finishDate:string;

  currentUser:User;

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    start: [new Date(), Validators.required],
    end: [new Date(), Validators.required]
    }
  )

  ngOnInit():void{
    this.currentDate = this.getCurrentDate();
    this.authService.get().subscribe(user=>this.currentUser = user);
  }

  

  getCurrentDate(): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, 'yyyy-MM-dd');
  }


  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    this.image = URL.createObjectURL(this.selectedFile);
  }

  saveProject(){
    if(this.projectForm.valid){
      console.log(this.projectForm.value.start)
      let project = new Project();
      project.name = this.projectForm.value.name;
      project.start = this.formatDate(this.projectForm.value.start); 
      project.end = this.formatDate(this.projectForm.value.end);
      project.description = this.projectForm.value.description;
      project.image = null;
      this.employeeService.addProject(project).subscribe(()=>{
          Swal.fire("Proyecto agregado","El proyecto se agrego correctamente a su perfil!","success");
          this.projectForm.reset();
      });
    }
  }
  formatDate(date:Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || null;
  }
}
