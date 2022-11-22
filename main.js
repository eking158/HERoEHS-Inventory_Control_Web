const express = require('express');
const app = express();

app.get('/', function(req,res) {
    res.sendFile(__dirname + "/public/main.html");
})

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/406', function(req,res){
    res.sendFile(__dirname + "/public/storages/406.html");
  })

app.get('/storage_1', function(req,res){
    res.sendFile(__dirname + "/public/storages/storage_1.html");
  })

app.get('/storage_2', function(req,res){
    res.sendFile(__dirname + "/public/storages/storage_2.html");
  })

app.get('/json', function(req,res){
    res.sendFile(__dirname + "/public/inventory_list_test_gui/json.html");
})

app.listen(3000, function(){
  console.log('Listening at 3000');
})



app.use(express.static('public'));