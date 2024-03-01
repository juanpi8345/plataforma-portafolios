import { Profile } from "./profile";

export interface Message{
    date:any ;
    content : string;
    sender : Profile;
    receiver : Profile;
    
}