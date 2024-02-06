import { Skill } from "./skill";
import { Project } from "./project";

export class Profile {
   name : string = '';
   occupations : string = '';
   description : string = '';
   projects : Project[] = [];
   skills : Skill[] = [];
   //employer
   searching : string = '';
   skillsSearched : Skill[] = [];

}
