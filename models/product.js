const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // colorOptions: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  //   get() {
  //     return this.getDataValue('colorOptions').split(';');
  //   },
  //   set(val) {
  //     this.setDataValue('colorOptions', val.join(';'));
  //   },
  // },
  // sizeOptions: {
  //   type: Sequelize.STRING,
  //   allowNull: false,
  //   get() {
  //     return this.getDataValue('sizeOptions').split(';');
  //   },
  //   set(val) {
  //     this.setDataValue('sizeOptions', val.join(';'));
  //   },
  // },
});

module.exports = Product;
