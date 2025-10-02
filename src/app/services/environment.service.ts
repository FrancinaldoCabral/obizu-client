import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    wpUrl:string = 'https://obizu.online'
    apiUrl:string = 'https://api.obizu.online' 
    //apiUrl:string = 'https://intense-reaches-77234-7e1b0e461334.herokuapp.com' //'https://api.obizu.online' 
}