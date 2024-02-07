import { Skill } from "./skill";
import { Profile } from "./profile";

export class Employer extends Profile{
  searching : string = '';
  searchedSkills : Skill[] = [];

}
