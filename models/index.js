const Sequelize = require('sequelize');
const Item = require('./item');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.Itemname, config.password, config);
db.sequelize = sequelize;

db.Item = Item;

Item.init(sequelize);

Item.associate(db);

module.exports = db;