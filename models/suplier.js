'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class suplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  suplier.init({
    name_sub: DataTypes.STRING,
    location: DataTypes.STRING,
    no_hp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'suplier',
  });
  return suplier;
};