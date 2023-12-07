import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-registeration',
  templateUrl: './user-registeration.component.html',
  styleUrls: ['./user-registeration.component.css']
})
export class UserRegisterationComponent {
  email:string="";
  password:string="";
  username:string="";
  DOB:string="";

  constructor(private http: HttpClient, private router: Router) {}

  login()
  {
    this.router.navigate(['/login']);
    
  }

  addUser(){
    let bodyData={    
      "username":this.username ,                   // will sent as payload in http request
      "email":this.email,
      "password":this.password,
      "DOB":this.DOB
    };

    console.log(this.username+" "+this.email+" "+this.password+" "+this.DOB);
    this.http.post("http://localhost:3000/api/user-register",bodyData,{responseType:'text'}).subscribe(resultData=>
    {
        if (resultData === "User Registered successfully") {
          alert("User Registered successfully");
          // Display appropriate message to the user
        } else {
        alert("Something Went Wrong, Please Retry");
        }  
        this.username="";
        this.email="";  
        this.password="";
        this.DOB="";
    });

 }

}
