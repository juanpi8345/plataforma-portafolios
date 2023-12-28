import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Profile } from '../../../model/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

    constructor(private authService:AuthService, private router:Router){}

    profile : Profile;

    ngOnInit():void{
      this.authService.get().subscribe((response:any)=>{
        this.profile = response.profile;
      },responseErr=>{
        if(responseErr.status === 403){
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
    }
  }
