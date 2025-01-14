'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class suplaiBB extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  suplaiBB.init({
    id_sub: DataTypes.INTEGER,
    bahan_baku: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    satuan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'suplaiBB',
  });
  return suplaiBB;
};