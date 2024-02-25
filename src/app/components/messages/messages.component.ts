import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from '../../model/message';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  profileId:number;
  getCurrentUserSubscription:Subscription;
  receiverId:number;
  messageInput : string = '';
  messageList : Message[] = [];

  constructor(private chatService:ChatService, private route:ActivatedRoute,private router:Router
    ,private authService:AuthService) {
  }

  ngOnInit():void{
    this.getCurrentUserSubscription = this.authService.get().subscribe(user=>{
      this.profileId = user.profile.profileId;
    })

    this.receiverId = this.route.snapshot.params["receiverId"];
    this.chatService.connect();
    this.listenerMessage();
  }

  sendMessage(){
    const chatMessage = {
      content: this.messageInput,
      senderProfileId: this.profileId,
      receiverProfileId: this.receiverId
    }as ChatMessage
    this.chatService.sendMessage(chatMessage);
    this.messageInput = '';
  }

  listenerMessage(){
    this.chatService.getMessageSubject().subscribe((messages:any)=>{
      this.messageList = messages.map((item:any)=>({
        ...item,
        message_side: item.sender.profileId == this.profileId ? 'sender': 'receiver'
      }))
     
    })
  }

  ngOnDestroy():void{
    if(this.getCurrentUserSubscription)
      this.getCurrentUserSubscription.unsubscribe();
  }
}
