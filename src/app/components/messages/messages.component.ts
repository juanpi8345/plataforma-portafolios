import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message } from '../../model/message';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent{
  profileId:number;
  getCurrentUserSubscription:Subscription;
  receiverId:number;
  messageInput : string = '';
  messageList : Message[] = [];
  historicalMessages$! : Observable<any[]>

  constructor(private chatService:ChatService, private route:ActivatedRoute,private router:Router
    ,private authService:AuthService) {
  }

  ngOnInit():void{
    this.route.params.subscribe((params: Params) => {
      this.receiverId = params['receiverId'];
      this.getCurrentUserSubscription = this.authService.get().subscribe(user=>{
        this.profileId = user.profile.profileId;
        this.historicalMessages$ = this.chatService.getChatMessages(this.receiverId,this.profileId);
      })
    });
 

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