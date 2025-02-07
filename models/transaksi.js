"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaksi.hasMany(models.detail_transaksi, {
        as: "details",
        foreignKey: "id_transaksi",
      });
    }
  }
  transaksi.init(
    {
      no_meja: DataTypes.INTEGER,
      id_kasir: DataTypes.INTEGER,
      id_payment_method: DataTypes.INTEGER,
      total_pembelian: DataTypes.STRING,
      nominal_pembeyaran: DataTypes.STRING,
      nominal_pengembalian: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "transaksi",
    }
  );
  return transaksi;
};
