import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../model/chat-message';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { Chat } from '../model/chat';
import { HttpClient } from '@angular/common/http';
import { Message } from 'postcss';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) {
      this.initConnectionSocket();
   }

  private stompClient : any;
  private messageSubject:BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private apiUrl : string  = "http://localhost:8080/chat/"

  initConnectionSocket(){
    //tcp connection
    const url = "//localhost:8080/chat-socket";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
  }

  closeWebSocket() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

 connect(){
    this.stompClient.connect({},()=>{
      this.stompClient.subscribe("/topic/messages",(messages:any)=>{
          const messageContent = JSON.parse(messages.body);
          const currentMessage = this.messageSubject.getValue();
          currentMessage.push(messageContent);
          this.messageSubject.next(currentMessage);
      })
    })
  }
  sendMessage(chatMessage:ChatMessage){
    this.stompClient.send("/app/chat",{},JSON.stringify(chatMessage));
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

  getProfileChats(profileId:number):Observable<Chat[]>{
    return this.http.get<Chat[]>(this.apiUrl+"profile/"+profileId).pipe(catchError(error=>{
      Swal.fire("Alerta","No tiene chats con ningun usuario","warning")
      return [];
    }));
  }

  getChatMessages(profileId1:number,profileId2:number):Observable<Message[]>{
    return this.http.get<Message[]>(this.apiUrl+"profile1/"+profileId1+"/profile2/"+profileId2);
  }
}
