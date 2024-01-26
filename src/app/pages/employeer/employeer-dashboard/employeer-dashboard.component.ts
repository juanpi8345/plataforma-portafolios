import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-employeer-dashboard',
  standalone: true,
  imports: [FooterComponent,MenuComponent,RouterOutlet],
  templateUrl: './employeer-dashboard.component.html',
  styleUrl: './employeer-dashboard.component.css'
})
export class EmployeerDashboardComponent {

}
