var mysql = require('mysql2');
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Robot1234!',
    database: 'inventoryDB'
});
db.connect();

module.exports = db;