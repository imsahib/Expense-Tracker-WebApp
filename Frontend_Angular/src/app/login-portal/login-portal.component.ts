import { Component,OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { UserService } from './user.service';
import { Optional } from '@angular/core';
import { Router } from '@angular/router';
interface ApiResponse{

}




@Component({
  selector: 'app-login-portal',
  templateUrl: './login-portal.component.html',
  styleUrls: ['./login-portal.component.css']
})
export class LoginPortalComponent implements OnInit{

  email:string="";
  password:string="";
  username:string=""
  constructor(private http: HttpClient, @Optional() public userService: UserService, private router: Router) {}
  

  register()
  {
    this.router.navigate(['/register']);
    
  }
  loginUser()
  {
    
    let bodyData={                        // will sent as payload in http request
      "email":this.email,
      "password":this.password,
    };
    console.log(this.email+this.password);
    this.http.post("http://localhost:3000/api/user-login",bodyData,{responseType:'text'}).subscribe(resultData=>
    {
      if (resultData === "User does not exist") {
        console.log("User does not exist");
        // Display appropriate message to the user
      } else {
        console.log("Username: " + resultData);
        if(this.userService)
        {
          this.userService.username = resultData;
          console.log(this.userService.username);
          
      }
      this.router.navigate(['/expenses'], { queryParams: { username: resultData } });
      }    
  });
  }


  ngOnInit() {
    this.http.get<ApiResponse>('http://localhost:3000/api').subscribe(response => {
      console.log(response) ;
      
      
    });
}
}
