import { Component} from '@angular/core';      // OnInit is a decorater
import { HttpClient } from '@angular/common/http';
import { UserService } from './login-portal/user.service';

interface ApiResponse {
  UserDetails: UserDetails[];
  ExpenseDetails:ExpenseDetails[];
  WalletDetails:WalletDetails[];
}

interface UserDetails {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface ExpenseDetails{
  id:number;
  description:any;
  category:string;
}
interface WalletDetails{
  id:number;
  incomeAmount:number;
  timestamp:any;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent{
  UserDetails:UserDetails[]=[];
  ExpenseDetails:ExpenseDetails[]=[];
  WalletDetails:WalletDetails[]=[];
  title = 'Expense-Tracker';
  username:string="";
  email:string="";
  password:any="";
  balance:any="";

  constructor(private http: HttpClient) {}


 register()
 {
  let bodyData={
    "username":this.username,
    "password":this.password,
    "email":this.email
  };

  this.http.post("http://localhost:3000/api/submit-form",bodyData,{responseType:'text'}).subscribe(resultData=>
  {
    console.log(resultData);
    alert("Registered Successfully");

    this.username="";
    this.email="";
    this.password="";

  });


 }

  makeRequest() {
    this.http.get<ApiResponse>('http://localhost:3000/api').subscribe(response => {
      console.log(response);
      this.UserDetails= response.UserDetails;
      this.ExpenseDetails=response.ExpenseDetails;
      this.WalletDetails=response.WalletDetails;
    
    });
  }
/*
  ngOnInit() {
    this.http.get<ApiResponse>('http://localhost:3000/api').subscribe(response => {
      console.log(response) ;
      this.UserDetails= response.UserDetails;
      this.ExpenseDetails=response.ExpenseDetails;
      this.WalletDetails=response.WalletDetails;
      this.balance=response.WalletDetails[0].incomeAmount;
        console.log(this.balance);
    });
  }*/
}
