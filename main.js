const express = require('express');
const app = express();

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/main.html");
})

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/406', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
  })

app.get('/storage_1', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
  })

app.get('/storage_2', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
})

app.get('/406/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/storage_1/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/storage_2/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})

app.listen(3000, function(){
  console.log('Listening at 3000');
})



app.use(express.static('public'));