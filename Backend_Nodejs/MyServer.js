var express=require('express'); // importing express.js 
var path= require('path');   // importing path module 
var logger =require('morgan');  // Middleware for logging HTTP request 
var bodyParser=require('body-parser');  // Middleware , which Parse the request body means: extract data from HTTP request 
var neo4j=require('neo4j-driver');  // so that i can link to my database 
var cors = require('cors');       // Cross Origin Resource Sharing : who can access server services from different domains

var app=express();  // creating an instance 
// Middleware
app.use(express.json());     // parse data in request body (To format data)



app.unsubscribe(logger('dev'));   // logger middleware logs the information about http request, response time and status
app.use(bodyParser.json());      // parse the json data into req body object for use
app.use(bodyParser.urlencoded({extended:true}));   // extended: parsing nested objects in the URL encoded data

//Middleware
app.use(cors(
    {
        origin:"http://localhost:4200"
    }

));


app.get('/api',function(req,res){
    var username = req.query.username;
    const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
    var session= driver.session();
    session
        .run('MATCH(user:UserDetails)-[expands:Expands]->(expense:Expense) WHERE user.username=$userParam RETURN expense',{'userParam':username})
        .then(function(result){
                var Expenditure= [];
                result.records.forEach(function(record){

                    Expenditure.push({
                        id:record._fields[0].identity.low,
                        description: record._fields[0].properties.description,
                        category: record._fields[0].properties.category,
                        amount: record._fields[0].properties.amount

                    });
                    
                });

        
            session
                .run('MATCH (n:UserDetails) RETURN n')
                .then(function(result2){
                        var UserArr=[];
                        result2.records.forEach(function(record){
                            UserArr.push({
                                id:record._fields[0].identity.low,
                                username: record._fields[0].properties.username,
                                email: record._fields[0].properties.email,
                                password: record._fields[0].properties.password


                        });
                    });

                    session
                    .run('MATCH (user:UserDetails)-[:OWNS]->(wallet:Wallet) WHERE user.username =$userParam RETURN wallet',{'userParam':username})
                    .then(function(result2){
                        var Wallet=[];
                        result2.records.forEach(function(record){
                            Wallet.push({
                                id:record._fields[0].identity.low,
                                incomeAmount: record._fields[0].properties.incomeAmount,
                                timestamp: record._fields[0].properties.timestamp

                        });
                    
            });



        res.json({
            ExpenseDetails:Expenditure,
            UserDetails:UserArr,
            WalletDetails:Wallet
    
            });
            session.close();
        })
            .catch(function(err){
                console.log(err);
            });

        })
       .catch(function(err){
             console.log(err);
    });

});

})

app.post('/api/user-register',function(req,res){

    var Username=req.body.username;
    var Email=req.body.email;
    var DOB=req.body.DOB;
    var Password=req.body.password;
    const { DateTime } = neo4j;
    const timePara = DateTime.fromStandardDate(new Date());
    console.log(Email+ " "+Password+" "+DOB+ " "+Username);

    const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
    var session= driver.session();

    session
    .run('CREATE (n:UserDetails {username: $userParam, email: $emailParam, DOB:$DobPara, password: $passParam}) RETURN n.username', {'userParam': Username, 'emailParam': Email,'DobPara':DOB,'passParam': Password})
    
    .then(function(result){

     })

    .catch(function(err){
      console.log(err);
  });


  var session= driver.session();

  // step 2: create a wallet and create a link
  session
  .run('CREATE (wallet:Wallet {incomeAmount:$amountPara, timeStamp:$timePara}) RETURN wallet' , {'amountPara':0,'timePara':timePara})
  
  .then(function(result){
            
            var id = result.records[0]._fields[0].identity.low;

            session.run('MATCH (user:UserDetails {email: $emailParam}), (wallet:Wallet) WHERE ID(wallet)=$WalID '+ 'CREATE (user)-[:OWNS]->(wallet)',{'emailParam':Email,'WalID':id})
                    .then(function(result){
                        session.close();
                        res.status(200).send("User Registered successfully");

                    })
                    .catch(function(err){
                        console.log(err);
                    })

        })

  .catch(function(err){
    console.log(err);
});
res.status(200).send("User Registered successfully");



});




app.post('/api/user-login',function(req,res){

    var Email=req.body.email;
    var Password=req.body.password;
    const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
    var session= driver.session();

    session
            .run('MATCH(user:UserDetails{email:$emailParam, password:$passParam})RETURN user',{"emailParam":Email,"passParam":Password})

            .then(function(result){
                    console.log(result);
                if (result.records.length === 0) {
                    res.send("User does not exist");
                }
                else{
                  var username= result.records[0].get(0).properties.username;
                 res.send(username);
               }

            })

            .catch(function(err){
                console.log(err);
            })
            

});

// When I submit my User Details
    
    app.post('/api/submit-form',function(req,res){

        var username = req.body.username;
        var email= req.body.email;
        var password= req.body.password;
    
        const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
        var session= driver.session();
    
        session
    
          .run('CREATE (n:UserDetails {username: $userParam, email: $emailParam, password: $passParam}) RETURN n.username', {'userParam': username, 'emailParam': email, 'passParam': password})
    
          .then(function(result){
            res.status(200).send('Form data received successfully');
    
            session.close();
            driver.close();
    
           })
    
          .catch(function(err){
            console.log(err);
        });
        res.status(200).send('Form data not received successfully');
    });
    


    // When i submit transaction
    app.post('/api/submit-transaction',function(req,res){
        var username=req.body.username;
        var amount = req.body.amount;                // req represents the request obj
        var category= req.body.category;
        var transaction= req.body.transaction;
        var description=req.body.description;
    
        const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
        var session= driver.session();
    
        session      // used to perform database operations
    
        // method  executes the cipher query
        // step 1: create expense node
          .run('CREATE (n:Expense {amount: $amountParam, category: $categoryParam, transaction: $transParam,description:$descParam}) RETURN n.category', {'amountParam': amount, 'categoryParam': category, 'transParam': transaction,'descParam':description})
    
          // after fullfilment of run query ,this function will take output of that query in this)
          .then(function(result){
        
            // step 2: create a relation between them
            session.run('MATCH (user:UserDetails {username: $usernameParam}), (exp:Expense {category: $categoryParam,transaction: $transParam,description:$descParam}) ' +
            'CREATE (user)-[:Expands {amount: $amountParam}]->(exp)', { usernameParam: username, categoryParam: category, amountParam: amount,transParam:transaction, descParam:description})
            .then(function (result) {
            // step 3: update wallet
                session.run(
                    'MATCH (user:UserDetails)-[:OWNS]->(wallet:Wallet) ' +
                     'WHERE user.username = $usernameParam ' +
                     'SET wallet.incomeAmount = wallet.incomeAmount-$newValue',
                     { usernameParam: username, newValue: amount }
                )

                .then(function(result){

                    res.status(200).send('Form data received successfully');
                    session.close();
                    driver.close();
                    
                  })

                // error handling
                .catch(function(err){
                    console.log(err);
                });


             
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    });





    app.post('/api/submit-income',function(req,res){

        var income = req.body.income;
        var username=req.body.username;
        console.log(username);
        const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
        var session= driver.session();
    
       
       
        session
        .run(
        'MATCH (user:UserDetails)-[:OWNS]->(wallet:Wallet) ' +
        'WHERE user.username = $usernamePara ' +
        'SET wallet.incomeAmount = wallet.incomeAmount+$newValue',
        { usernamePara: username, newValue: income }
        )
        .then(function(result) {
        console.log('Wallet property updated');
        res.status(200).send('Form data received successfully');
        session.close();
        driver.close();
        
        })
        .catch(function(error) {
        console.log(error);
        session.close();
        driver.close();
       
        });

    }); 

// To delete a transaction
    app.post('/api/delete-tran',function(req,res){

        var id = req.body.id;
        const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
        var session= driver.session();
    
        
   session.run('MATCH (node:Expense) WHERE ID(node) = $ExpID DETACH DELETE node', {'ExpID': id})

          .then(function(result){
            res.status(200).send('Transaction Deleted Successfully');
            console.log('Transaction Deleted Successfully');
            session.close();
            driver.close();
    
           })
    
          .catch(function(err){
            console.log(err);
            session.close();
            driver.close();
        });
    });

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Promise Rejection:', err);
        // Handle the error or perform any necessary cleanup
      });
    





app.listen(3000);   // port
console.log('Server started on port 3000');
