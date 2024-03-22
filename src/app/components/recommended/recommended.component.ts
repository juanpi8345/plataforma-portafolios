import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Observable, Subscription, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Profile } from '../../model/profile';

@Component({
  selector: 'app-recommended',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recommended.component.html',
  styleUrl: './recommended.component.css'
})
export class RecommendedComponent {

  constructor(public profileService: ProfileService) {

  }

  recommendedProfiles: Profile[];
  profilesSubscription: Subscription;

  ngOnInit(): void {
    this.profilesSubscription = this.profileService.getRecommended().subscribe((profiles: Profile[]) => {
      this.recommendedProfiles = profiles;
      profiles.forEach(p=>{this.loadImage(p)});
    }),err=>{console.log(err)};
  }

  loadImage(profile: Profile): void {
   let image = this.profileService.getOtherProfileImage(profile.profileId).pipe(
      map(blob => {
        return URL.createObjectURL(blob);
      })
    );
   image.subscribe(image=>{
      profile.image = image;
   });
  }


}


