import { Component } from '@angular/core';
import { FooterComponent } from '../../../components/footer/footer.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { RecommendedComponent } from '../../../components/recommended/recommended.component';

@Component({
  selector: 'app-employeer-dashboard',
  standalone: true,
  imports: [FooterComponent,MenuComponent,RouterOutlet,RecommendedComponent],
  templateUrl: './employeer-dashboard.component.html',
  styleUrl: './employeer-dashboard.component.css'
})
export class EmployeerDashboardComponent {

}
