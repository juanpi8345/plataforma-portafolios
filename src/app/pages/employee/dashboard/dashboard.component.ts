import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/menu/menu.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MenuComponent,FooterComponent,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
