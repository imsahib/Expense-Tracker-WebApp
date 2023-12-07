import { Component,OnInit,Input } from '@angular/core';      // Component : used to define angular components
import { HttpClient ,HttpParams} from '@angular/common/http';    //OnInit : Interface that defines a lifecycle hook method ngOnInit()
                                          //lifecycle hook method: they can be called anytime and hook the things into your component
import { UserService } from '../login-portal/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// Interface defines the structure or shape of an object
interface ApiResponse {
  ExpenseDetails:ExpenseDetails[];
  UserDetails: UserDetails[];
  WalletDetails:WalletDetails[];

}
interface UserDetails {
  id: number;
  username: string;
  email: string;
  password: string;
}
interface ExpenseDetails{
  id: number;
  username:string;
  description:any;
  category:string;
  amount:number;
}
interface WalletDetails{
  id:number;
  username:string;
  incomeAmount:number;
  timestamp:any;
}
@Component({
  selector: 'app-expense-portal',
  templateUrl: './expense-portal.component.html',
  styleUrls: ['./expense-portal.component.css']
})
export class ExpensePortalComponent implements OnInit {
  ExpenseDetails:ExpenseDetails[]=[];
  UserDetails:UserDetails[]=[];
  WalletDetails:WalletDetails[]=[];
  amount:number=0;
  description:string="";
  transaction:string="";
  category:string="";
  income:number=0;
  id:number=0;
  username:string="";
  showTransactionCard: boolean = true;
  storedIncome: number=0;
  constructor(private http: HttpClient,public userService: UserService,private route: ActivatedRoute,private router: Router) {
    this.storedIncome = Number(localStorage.getItem('storedIncome')) || 0;
  }

    logout(){
  
      this.router.navigate(['/login']);
    }
    OnDeleteBalance(){
      this.showTransactionCard = false;
    }
  addIncome()
  {
    this.storedIncome = this.income;
    let bodyData={
      "income":this.income,
      "username":this.username

    };
    localStorage.setItem('storedIncome', this.storedIncome.toString());
    this.http.post("http://localhost:3000/api/submit-income",bodyData,{responseType:'text'}).subscribe(resultData=>
    {
      console.log(resultData);
      
  });
  this.income=0;
  window.location.reload();
}
  addTransaction()
  {
    let bodyData={   
      "username":this.username,                     // will sent as payload in http request
      "amount":this.amount,
      "category":this.category,
      "transaction":this.transaction,
      "description":this.description
    };
  // Response type: Expected response from server is be in text, subscribe take call back function , which execute after response
    this.http.post("http://localhost:3000/api/submit-transaction",bodyData,{responseType:'text'}).subscribe(resultData=>
    {
      console.log(resultData);
      alert("Transaction Added Successfully");
   // Reset the values 
      this.amount=0;                       
      this.category="";
      this.transaction="";
      this.description="";
    });

    window.location.reload();    // refresh the entire  web page
  
  
   }

   OnDelete(id:number)
   {
        let bodyData={
          "id":id
        };

        this.http.post("http://localhost:3000/api/delete-tran",bodyData,{responseType:'text'}).subscribe(resultData=>
        {
          console.log(resultData);
          alert("Transaction Deleted Successfully");
        });

        window.location.reload();
   }

   // it runs in the initialization phase of a component
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    });
    const params = new HttpParams().set('username',this.username);
    this.http.get<ApiResponse>('http://localhost:3000/api',{params}).subscribe(response => {
      this.ExpenseDetails= response.ExpenseDetails;
      console.log(this.ExpenseDetails)
      this.WalletDetails=response.WalletDetails;
     this.income=response.WalletDetails[0].incomeAmount;
     this.route.queryParams.subscribe(params => {
      this.username = params['username'];
    })
      
    });
  }

}
