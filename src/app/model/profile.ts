import { Skill } from "./skill";
import { Project } from "./project";

export class Profile {
   name : string = '';
   occupations : string = '';
   description : string = '';
   image : File;
   projects : Project[] = [];
   skills : Skill[] = [];
}