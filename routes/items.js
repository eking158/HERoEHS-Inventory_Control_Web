const express = require('express');
const Item = require('../models/item');
const { Op } = require('sequelize');

const router = express.Router();

// 검색어를 사용하여 mysql 데이터 검색 -> 필터된 데이터 return
router.post('/', async (req, res, next) => {
    try {
        const search = req.body.search_item;    // 검색어
        const search_result = await Item.findAll({
            // raw: true,          // dataValues 이외의 값 제거
            where: {
                name: { 
                    [Op.like]: '%' + search + '%'
                },
            }
        });
        // console.log(search_result);
        res.status(201).json(search_result);
    } catch (err) {
        console.error(err);
        next(err);
    }
  });


// router.route('/').post(async (req, res, next) => {     // 물품 등록 요청 처리
//     try {
//       const item = await Item.create({
//         name: req.body.name,
//         L_category: req.body.L_category,
//         S_category: req.body.S_category,
//         room: req.body.room,
//         box: req.body.box,
//         count: req.body.count,
//         etc: req.body.etc,
//       });
//       console.log(item);
//       res.status(201).json(item);
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
// });

module.exports = router;