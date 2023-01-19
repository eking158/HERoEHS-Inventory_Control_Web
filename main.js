const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const xlsx = require('xlsx');
const nunjucks = require('nunjucks');
const session = require('express-session')
// const FileStore = require('session-file-store')(session)

const { sequelize } = require('./models');
const indexRouter = require('./routes');
const itemsRouter = require('./routes/items');
const authRouter = require('./public/login/auth');
const authCheck = require('./public/login/authCheck.js');
const template = require('./public/login/template.js');
const { DATE } = require('sequelize');

const app = express();

function load_json(req, res) {
  const dir = __dirname + "/public/test/inventory.json"
  const dataBuffer = fs.readFileSync(dir);
  const dataJSON = JSON.parse(dataBuffer);
  return dataJSON;
}

function save_json(dataJSON) {
  const bookJSON = JSON.stringify(dataJSON)
  fs.writeFileSync(path.join(__dirname, 'public/test/inventory.json'), bookJSON);
}

function log_json(logJSON) {
  const date = new Date();
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  const today = year + '-' + month  + '-' + day;
  const presentTime = hours + ':' + minutes  + ':' + seconds;

  const log = logJSON + " " + today + " " + presentTime + "\n";
  fs.appendFileSync(path.join(__dirname, "public/login/log.txt"), log);
}



function save_excel(dataJSON) {
  const sheetnames = Object.keys(dataJSON);
  console.log(sheetnames);
  let i = sheetnames.length;
  let resData;
  const workbook = xlsx.utils.book_new();
  while (i--) {
    const sheetname = sheetnames[i];
    worksheet = xlsx.utils.json_to_sheet(dataJSON[sheetnames[i]]); //npo
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetnames[i]);
  }
  xlsx.writeFile(workbook, path.join(__dirname, 'array_to_sheet_result.xlsx'));
}

app.set('port', process.env.PORT || 3001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/index', indexRouter);
app.use('/items', itemsRouter);

app.get('/searching_database', function (req, res) {
  res.sendFile(__dirname + "/public/searching/searching_database.html");
})

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'inventory',	// 원하는 문자 입력
  cookie: {
    httpOnly: true,
    secure: false,
  },
  //store: new FileStore(),
}));

app.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect('/auth/login');
    return false;
  } else {                                      // 로그인 되어있으면 메인 페이지로 이동시킴
    const s = req.session.nickname;   // for log
    log_json(s);

    res.sendFile(__dirname + "/public/sequelize.html");
    return false;
  }
})

// 인증 라우터
app.use('/auth', authRouter);

// localhost:3000/main 브라우저에 res.sendFile() 내부의 파일이 띄워진다.
app.get('/406', function (req, res) {
  res.sendFile(__dirname + "/public/storages/storages.html");
})

app.get('/B05', function (req, res) {
  res.sendFile(__dirname + "/public/storages/storages.html");
})

app.get('/B09-3', function (req, res) {
  res.sendFile(__dirname + "/public/storages/storages.html");
})

app.get('/406/:id', function (req, res) {
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/B05/:id', function (req, res) {
  res.sendFile(__dirname + "/public/test/inventory.html");
})
app.get('/B09-3/:id', function (req, res) {
  res.sendFile(__dirname + "/public/test/inventory.html");
})

app.get('/search', function (req, res) {
  res.sendFile(__dirname + "/public/searching/searching.html");
})

app.get('/action_page.php', function (req, res) {
  console.log(req.query); //상세물품변경
  let dataJSON = load_json(req, res);
  const sheetnames = Object.keys(dataJSON['datas']);
  var i = sheetnames.length;
  console.log(i);
  var data_var = ['name', 'count', 'L_category', 'S_category', 'room', 'box'];
  var req_var = ['object_name', 'object_count', 'object_L_category', 'object_S_category', 'object_room', 'object_box'];
  var new_var = ['new_defalut_name', 'object_count', 'new_defalut_L_category', 'new_defalut_S_category', 'object_room', 'new_defalut_box'];

  var log_string = "user ";

  while (i--) {
    //console.log(dataJSON['datas'][sheetnames[i]].name+" -- " + req.query.object_name);
    if (dataJSON['datas'][sheetnames[i]].id == req.query.object_id) {
      var j = data_var.length;
      while (j--) {
        var before = dataJSON['datas'][sheetnames[i]][data_var[j]];
        var after = req.query[req_var[j]];
        //console.log(data_var[j] +" --> "+req_var[j]);
        if (before != after && after != '') {
          console.log(data_var[j] + " : " + before + " --> " + after);
          dataJSON['datas'][sheetnames[i]][data_var[j]] = after;

          log_string = log_string + data_var[j] + " : " + before + " --> " + after + " ";   // for log
        }
        else {
          console.log(data_var[j] + " : " + before + " = " + after);
          
          log_string = log_string + data_var[j] + " : " + before + " = " + after + " ";     // for log
        }
      }
    }
  }
  if (sheetnames.length == req.query.new_defalut_id) {
    console.log("new part!");
    var j = data_var.length + 1;
    var inner_string = {};
    while (j-- > 1) {
      inner_string[data_var[data_var.length - j]] = req.query[new_var[data_var.length - j]];
    }
    inner_string["id"] = req.query.new_defalut_id;
    //console.log(inner_string);
    dataJSON['datas'].push(inner_string);
    //console.log(dataJSON['datas'][sheetnames.length-2]);
    //console.log(dataJSON['datas'][sheetnames.length-1]);
    //console.log(dataJSON['datas'][sheetnames.length]);
  }

  log_json(log_string);          // for log

  save_json(dataJSON);
  res.sendFile(__dirname + "/public/test/complete.html");
})

app.get('/change.php', function (req, res) {
  console.log(req.query);
  let dataJSON = load_json(req, res);
  console.log(dataJSON['datas'][req.query.id]);
  console.log(dataJSON['datas'][req.query.id]['count']);
  dataJSON['datas'][req.query.id]['count'] = req.query.number

  const s = req.session.nickname;
  console.log("---------------------");
  console.log(req.session);
  // const s = JSON.stringify(dataJSON['datas'][req.query.id]);
  log_json(s);


  save_json(dataJSON);
  console.log(dataJSON['datas'][req.query.id]['count']);
  save_excel(dataJSON);
  res.sendFile(__dirname + "/public/test/complete.html");

  //res.sendFile(__dirname + "/public/sequelize.html");
})


app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});