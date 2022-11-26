const express = require('express');
const app = express();

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/main.html");
})

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/406', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
  })

app.get('/B05', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
  })

app.get('/B09-3', function(req,res){
    res.sendFile(__dirname + "/public/storages/storages.html");
})

app.get('/406/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/B05/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/B09-3/:id', function(req,res){
  res.sendFile(__dirname + "/public/test/inventory.html");
})

app.get('/search', function(req,res){
  res.sendFile(__dirname + "/public/searching/searching.html");
})


app.listen(3000, function(){
  console.log('Listening at 3000');
})



app.use(express.static('public'));