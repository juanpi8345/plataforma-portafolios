import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  constructor(private authService:AuthService, private router:Router){}
  role : string;

  profileId:number;

  ngOnInit(){
    this.role = this.authService.getUserRol();
    this.profileId = this.authService.getUser().profile.profileId;
  }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
