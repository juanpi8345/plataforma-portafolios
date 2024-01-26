import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  ngOnInit(){
    this.role = this.authService.getUserRol();
  }

  public logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
