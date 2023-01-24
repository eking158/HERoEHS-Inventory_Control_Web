const express = require('express');
const jsonFile = require('../public/test/inventory.json')
const Item = require('../models/item');
const { Op } = require('sequelize');

const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

function load_json(){
  const dir = __dirname + "/../public/test/inventory.json"
  const dataBuffer = fs.readFileSync(dir);
  const dataJSON = JSON.parse(dataBuffer);
  return dataJSON;
}

// json 파일의 물품을 mysql database로 백업
router.post('/prev', async (req, res, next) => {
    // database의 id 값을 모두 가져옴
    const itemId = await Item.findAll({
        raw: true,          // dataValues 이외의 값 제거
        attributes: ['id']
    });

    // 가져온 id 값과 json 파일 내부의 id 값을 비교하여 item 백업 진행
    for (const room in jsonFile) {
        const object = jsonFile[room];
        for (const index in jsonFile[room]) {
            const jitem = object[index];
            console.log(jitem["name"]);

            if (itemId.find(item => item.id === jitem["id"]) === undefined) {     // database에 없으면
                // item 추가
                try {
                    Item.create({
                        id: jitem["id"],
                        name: jitem["name"],
                        L_category: jitem["L_category"],
                        S_category: jitem["S_category"],
                        room: jitem["room"],
                        box: jitem["box"],
                        count: jitem["count"],
                        etc: jitem["etc"]
                    });
                } catch (err) {
                    console.error(err);
                    next(err);
                }
            }
            else {      // database에 있으면
                // item 갱신(수정)
                try {
                    Item.update({
                        name: jitem["name"],
                        L_category: jitem["L_category"],
                        S_category: jitem["S_category"],
                        room: jitem["room"],
                        box: jitem["box"],
                        count: jitem["count"],
                        etc: jitem["etc"]
                    }, {
                        where: { id: jitem["id"] }
                    });
                } catch (err) {
                    console.error(err);
                    next(err);
                }
            }
        }
    };

    console.log('inventory.json 파일을 읽도록 요청했습니다.');
});

router.post('/change', async (req, res, next) => {
    let dataJSON = load_json();
    try {
        Item.update({
            count: dataJSON['datas'][req.query.id]['count']
        }, {
            where: { id: req.query.id }
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
    //console.log(req.query.id);
    //console.log(dataJSON['datas'][req.query.id]);
    //console.log('Do work properly?');
});



module.exports = router;