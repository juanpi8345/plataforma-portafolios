import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Project } from '../../model/project';
import Swal from 'sweetalert2';
import { EmployeeProfileComponent } from '../../pages/employee/employee-profile/employee-profile.component';


@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent {

  constructor(private fb:FormBuilder, private datePipe:DatePipe,
    private employeeService:EmployeeService){
    
  }

  @Output() addedProject = new EventEmitter<Project>();
  

  selectedFile: File;
  image : string;
  currentDate : string;
  startDate:string;
  finishDate:string;

  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    start: [new Date(), Validators.required],
    end: [new Date(), Validators.required]
    }
  )

  ngOnInit():void{
    this.currentDate = this.getCurrentDate();
  }

  //Output
  sendProjectToParentComponent(project:Project){
    this.addedProject.emit(project);
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
      project.image = null; //coming soon
      this.sendProjectToParentComponent(project);
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
