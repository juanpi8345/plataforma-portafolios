import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FooterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public login : boolean = true;
  public isVisible : boolean = false; 

  public toggleLogin():void{
    this.login = ! this.login;
  }

  onElementVisible(isVisible: boolean) {
    this.isVisible = isVisible;
  }

}
