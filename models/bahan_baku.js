'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bahan_baku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bahan_baku.init({
    title: DataTypes.STRING,
    id_sub: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    satuan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bahan_baku',
  });
  return bahan_baku;
};