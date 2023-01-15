var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'ls-44241f46297a5960bd783ef5c23f57ed8a10e7c3.cqzmsctc2nun.ap-northeast-2.rds.amazonaws.com',
    user: 'dbmasteruser',
    password: 'useiteasier',
    database: 'inventoryDB'
});
db.connect();

module.exports = db;