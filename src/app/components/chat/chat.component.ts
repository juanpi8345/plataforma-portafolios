import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, catchError, map } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
import { Chat } from '../../model/chat';
import { MessagesComponent } from '../messages/messages.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../model/profile';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule,CommonModule,MessagesComponent,RouterOutlet,MessagesComponent,RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  profileId : number;

  getCurrentUserSubscription:Subscription;
  getChats:Subscription;
  currentUser : User;

  chats : Chat[] = [];

  constructor(private chatService:ChatService, private profileService:ProfileService,
    private route:ActivatedRoute,private authService:AuthService,private router:Router) {
  }

  ngOnInit():void{
    this.chatService.initConnectionSocket();
    this.chatService.connect();
    this.getCurrentUserSubscription = this.authService.get().subscribe(user=>{
      this.profileId = user.profile.profileId;
      this.getChats = this.chatService.getProfileChats(this.profileId).subscribe((chats:Chat[])=>{
        chats.forEach((chat:Chat)=>{this.loadImage(chat.profile1); this.loadImage(chat.profile2)});
        this.chats = chats;
      },err=>{this.chats = [null];});
    })
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

  ngOnDestroy():void{
    this.chatService.closeWebSocket();
    if(this.getCurrentUserSubscription)
      this.getCurrentUserSubscription.unsubscribe();
  }

  

}
