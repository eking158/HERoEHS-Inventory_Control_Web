const express = require('express');
var multer = require('multer'); 

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// json 파일의 물품을 mysql database로 백업

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null,'./public/images/objects') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    //cb(null,path.join(__dirname, '../public/images/objects')) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    cb(null,path.join(__dirname, '../public/images/objects')) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: (req, file, cb) => {
    var mimeType;

    switch (file.mimetype) {
      case "image/jpeg":
        mimeType = ".jpg";
      break;
      case "image/png":
        mimeType = ".png";
      break;
      case "image/gif":
        mimeType = ".gif";
      break;
      case "image/bmp":
        mimeType = ".bmp";
      break;
      default:
        mimeType = ".jpg";
      break;
    }
    console.log("disk에서 데이터 : ", req.body);
    cb(null, mimeType);
  }
})

const upload = multer({storage: storage})

function load_sector() {
  const dir = __dirname + "/../public/test/complete.json"
  const dataBuffer = fs.readFileSync(dir);
  const dataJSON = JSON.parse(dataBuffer);
  return dataJSON;
}

/*
router.post('/', upload.single('object_picture'),(req,res)=>{
  const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file
  fs.renameSync(path, destination+"/"+req.body.picture_id+filename);
  console.log("body 데이터 : ", req.body);
  console.log("폼에 정의된 필드명 : ", fieldname);
  console.log("사용자가 업로드한 파일 명 : ", originalname);
  console.log("파일의 엔코딩 타입 : ", encoding);
  console.log("파일의 Mime 타입 : ", mimetype);
  console.log("파일이 저장된 폴더 : ", destination);
  console.log("destinatin에 저장된 파일 명 : ", filename);
  console.log("업로드된 파일의 전체 경로 ", path);
  console.log("파일의 바이트(byte 사이즈)", size);
  res.sendFile(__dirname + "/../public/test/complete.html");
})
*/


router.post('/', upload.single('object_picture'), async (req,res,next)=>{
    const { fieldname, originalname, encoding, mimetype, destination, filename, path, size } = req.file;
    var new_name = destination+"/"+req.body.picture_id+filename;
    await fs.rename(path, new_name,function(err){
        if(err) throw err;
        console.log("body 데이터 : ", req.body);
        console.log("폼에 정의된 필드명 : ", fieldname);
        console.log("사용자가 업로드한 파일 명 : ", originalname);
        console.log("파일의 엔코딩 타입 : ", encoding);
        console.log("파일의 Mime 타입 : ", mimetype);
        console.log("파일이 저장된 폴더 : ", destination);
        console.log("destinatin에 저장된 파일 명 : ", filename);
        console.log("업로드된 파일의 전체 경로 ", path);
        console.log("파일의 바이트(byte 사이즈)", size);
    })            
    //return res.redirect("/picture/picture_complete"); //임시
    let dataJSON = load_sector();
    var picture_sector;
    for(i = 1;i<=dataJSON[req.body.picture_room][0]["Length"];i++){
        for(j = 0;j<dataJSON[req.body.picture_room][0][i].length;j++){
            if(dataJSON[req.body.picture_room][0][i][j] == req.body.picture_box){
                picture_sector = i
                break;
            }
        }
    }
    return res.redirect("/" + req.body.picture_room + "/" + picture_sector + "/" + req.body.picture_box);
})

router.get('/picture_complete', (req, res) => {
    console.log("here???");
})

module.exports = router;