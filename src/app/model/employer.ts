import { Skill } from "./skill";
import { Profile } from "./profile";

export class Employer extends Profile{
  profileId:number;
  searching : string = '';
  searchedSkills : Skill[] = [];

}
