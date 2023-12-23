import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormBuilder, FormControl, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserDTO } from '../../model/user-dto';
import Swal from 'sweetalert2';
import { Login } from '../../model/login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FooterComponent,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public login : boolean = true;
  public isVisible : boolean = false; 
  public isEqual : boolean = false;
  public user : UserDTO = new UserDTO();
  userLogin:Login = new Login();

  constructor(private fb:FormBuilder, private authService:AuthService) {}

  registerForm = this.fb.group({
    username : ['',Validators.required],
    email: ['',Validators.required],
    role: ['EMPLOYEE',Validators.required],
    password: ['',Validators.required],
    passwordConfirm : ['',Validators.required]
  })

  loginForm = this.fb.group({
    username : ['',Validators.required],
    password: ['',Validators.required]
  })

  public toggleLogin():void{
    this.login = ! this.login;
  }

  onElementVisible(isVisible: boolean) {
    this.isVisible = isVisible;
  }

  comparePasswords(){
    if(this.registerForm.get('password')?.value == this.registerForm.get('passwordConfirm')?.value )
      this.isEqual = true;
    else
      this.isEqual = false;
  }

  registerUser():void{
    if(this.registerForm.valid){
      this.user.username = this.registerForm.get('username')?.value??'';
      this.user.email = this.registerForm.get('email')?.value??'';
      this.user.role = this.registerForm.get('role')?.value??'';
      this.user.password = this.registerForm.get('password')?.value??'';
      this.authService.registerUser(this.user).subscribe(()=>{
          Swal.fire({
            icon: 'success',
            title: 'Usuario registrado',
            text: 'El usuario fue registrado correctamente!',
            confirmButtonColor: '#8a2be2', 
          });
          this.login = true;
          this.registerForm.reset();
      },responseErr=>{
        if(responseErr.status === 409){
          Swal.fire({
            icon: 'error',
            title: 'Username ya registrado',
            text: 'Por favor intenta con otro username',
            confirmButtonColor: '#8a2be2', 
          });
        }
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Por favor contacte con el administrador',
        confirmButtonColor: '#8a2be2', 
      });
    }
  }

  authenticate():void{
    if(this.loginForm.valid){
      this.userLogin.username = this.loginForm.get('username')?.value??'';
      this.userLogin.password = this.loginForm.get('password')?.value??'';
      console.log(this.userLogin)
      this.authService.authenticate(this.userLogin).subscribe((response:any)=>{
          console.log(response.jwt);
      },responseErr=>{
        if(responseErr.status === 403){
          Swal.fire({
            icon: 'error',
            title: 'Credenciales incorrectas',
            text: 'Nombre de usuario o contraseñas incorrectas',
            confirmButtonColor: '#8a2be2', 
          });
        }
      })
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Por favor contacte con el administrador',
        confirmButtonColor: '#8a2be2', 
      });
    }
  }



}
