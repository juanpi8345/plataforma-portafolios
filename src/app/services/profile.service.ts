import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  private apiUrl : string  = "http://localhost:8080/profile/"

  public getProfile(profileId:number):Observable<any>{
    return this.http.get(this.apiUrl+"get/"+profileId);
  }

  public uploadImage(file:File):Observable<any>{
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl+ "add/image?file=",formData);
  }
  
  public getImage():Observable<any>{
    return this.http.get(this.apiUrl+"get/image",{ responseType: 'blob' });
  }
  
  public getOtherProfileImage(profileId:number):Observable<any>{
    return this.http.get(this.apiUrl+profileId+"/get/image",{ responseType: 'blob' });
  }
  

  public getRecommended():Observable<any>{
    return this.http.get(this.apiUrl+"get/recommended").pipe(catchError(error=>{
      return null;
    }));
  }

  public editName(name:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/name?name="+name,null);
  }

  public editDescription(description:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/description?description="+description,null);
  }

  public editOccupation(occupations:string):Observable<any>{
    return this.http.put(this.apiUrl + "edit/occupation?occupations="+occupations,null);
  }



}
