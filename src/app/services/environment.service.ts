import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    wpUrl:string = 'https://obizu.online'
    //apiUrl:string = 'https://api.obizu.online' 
    apiUrl:string = 'https://obizu-c95bfa20dc69.herokuapp.com/' 
}