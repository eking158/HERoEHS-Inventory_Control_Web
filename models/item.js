const Sequelize = require('sequelize');

module.exports = class Item extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true,
      },
      L_category: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      S_category: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      room: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      box: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      etc: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Item',
      tableName: 'itemTable',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }
  static associate(db) {}
};