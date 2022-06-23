const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

app.use(express.json());

app.get('/wall', function (req, res) {//returns all messages
  let messages=getMessagesFromDb();
  res.json(messages);
})

app.get('/wall/:username',function (req,res){//returns messages written by a user
  let username = req.params.username;
  let userMessages=getMessagesFromDb(username);
  res.json(userMessages);
})

app.post('/wall/:username',function(req,res){// writes a new message submitted by a user
  let username = req.params.username;
  let message = req.body.msg;
  writeMessageToDb(username,message);
  res.json({
    "status":"Your message was written on the databse"   
  })
})

app.listen(port, () => {
  console.log(`DiaryOnWall app listening on port ${port}`)
})


function writeMessageToDb(username,message){//writes a message to the database
  let jsonDatabase=readDatabaseAsJson();

  let userMessages=jsonDatabase[username];

  if(userMessages == null){
    userMessages=[];   
  }

  userMessages.push(message);
  
  jsonDatabase[username]=userMessages;
  
  fs.writeFileSync('database.json', JSON.stringify(jsonDatabase));
}

function getMessagesFromDb(username){// get messages from the database 
  let jsonDatabase=readDatabaseAsJson();

  if(username==null) return jsonDatabase;
  else return jsonDatabase[username];
}

function readDatabaseAsJson(){
  let jsonDatabase = null;
  try{
    let rawDatabase = fs.readFileSync('database.json');
    jsonDatabase = JSON.parse(rawDatabase);  
  }catch(e){
    jsonDatabase={};
  }
  return jsonDatabase;
}