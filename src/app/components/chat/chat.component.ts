import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
import { Chat } from '../../model/chat';
import { MessagesComponent } from '../messages/messages.component';

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
  currentUser : User;

  chats$! : Observable<any>;

  constructor(private chatService:ChatService,
    private route:ActivatedRoute,private authService:AuthService,private router:Router) {
  }

  ngOnInit():void{
    this.getCurrentUserSubscription = this.authService.get().subscribe(user=>{
      this.profileId = user.profile.profileId;
      this.chats$ = this.chatService.getProfileChats(this.profileId);
    })
  }


  ngOnDestroy():void{
    if(this.getCurrentUserSubscription)
      this.getCurrentUserSubscription.unsubscribe();
  }

  

}
