var express=require('express');
var path= require('path');
var logger =require('morgan');
var bodyParser=require('body-parser');
const neo4j=require('neo4j-driver');
const cors = require('cors');
var app=express();

// view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(cors());
app.unsubscribe(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));  // our folder is called public
app.use(bodyParser.json());

try {
    const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
    var session=driver.session();

  } catch (error) {

    console.error('Error connecting to Neo4j:', error);
  }


app.get('/',function(req,res){

    session
        .run('MATCH (n:Expense) RETURN n')
        .then(function(result){
                var Expenditure= [];
                result.records.forEach(function(record){
                    Expenditure.push({
                        id:record._fields[0].identity.low,
                        amount: record._fields[0].properties.amount,
                        category: record._fields[0].properties.category

                    });
                    
                });
    session
        .run('MATCH (n:UserDetails) RETURN n')
        .then(function(result2){
            var UserArr=[];
            result2.records.forEach(function(record){
                UserArr.push({
                    id:record._fields[0].identity.low,
                    username: record._fields[0].properties.username


            });
        });
        res.render('index',{
            Expense:Expenditure,
            UserDetails:UserArr

            });
        })
            .catch(function(err){
                console.log(err);
            });

        })
       .catch(function(err){
             console.log(err);
    });

});


app.post('/user/add',function(req,res){

    var username = req.body.username;
    var email= req.body.email;
    var password= req.body.password;

    const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '12345678'));
    var session= driver.session();

    session

      .run('CREATE (n:UserDetails {username: $userParam, email: $emailParam, password: $passParam}) RETURN n.username', {'userParam': username, 'emailParam': email, 'passParam': password})

      .then(function(result){
        res.redirect('/');

        session.close();

       })

      .catch(function(err){
        console.log(err);
    });
    res.redirect('/');
});
app.listen(3000);   // port
console.log('Server started on port 3000');
module.exports=app;