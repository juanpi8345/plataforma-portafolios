import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css'
})
export class RecommendedComponent {

  constructor(private profileService:ProfileService) {
    
  }

  recommendedProfiles$!:Observable<any>;

  ngOnInit():void{
   this.recommendedProfiles$ = this.profileService.getRecommended();
  }

}
