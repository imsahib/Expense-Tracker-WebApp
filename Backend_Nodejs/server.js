// Import required modules
const {response}=require('express')
const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser')


// Create an instance of Express server
const app = express();



// Enable CORS
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true,
}))

app.use(express.static(process.cwd()+"/dist/test-app/"))

// Define a sample API endpoint
app.get('/api', (req, res) => {
  const greeting = 'Hello Angular, A message from Server!';
  res.json({name:'Gurmeet Singh',email:'Gurmeet@server.com',password:'1234'});
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
