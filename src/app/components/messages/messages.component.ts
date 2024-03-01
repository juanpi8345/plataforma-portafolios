import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../model/chat-message';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Message } from '../../model/message';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';




@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule,CommonModule,DatePipe],
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
  receiverProfile$! : Observable<any>

  constructor(private chatService:ChatService, private route:ActivatedRoute,private router:Router
    ,private authService:AuthService,private datePipe: DatePipe, private profileService:ProfileService) {
  }

  ngOnInit():void{
    this.route.params.subscribe((params: Params) => {
      this.messageList = [];
      this.historicalMessages$ = null;
      this.receiverId = params['receiverId'];
      this.receiverProfile$ = this.profileService.getProfile(this.receiverId);
      this.getCurrentUserSubscription = this.authService.get().subscribe(user=>{
        this.profileId = user.profile.profileId;
        this.historicalMessages$ = this.chatService.getChatMessages(this.receiverId,this.profileId);
      })
    });
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

  formatDate(date:any):string{
    return this.datePipe.transform(date, 'd/M/yy, h:mm a');
  }

  ngOnDestroy():void{
    this.messageList = [];
    if(this.getCurrentUserSubscription)
      this.getCurrentUserSubscription.unsubscribe();
  }
}
