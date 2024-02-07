import { Skill } from "./skill";
import { Project } from "./project";
import { Profile } from "./profile";

export class Employee extends Profile{
   projects : Project[] = [];
   skills : Skill[] = [];

}
