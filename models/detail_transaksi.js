"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      detail_transaksi.belongsTo(models.transaksi, {
        as: "transaksi", // Alias untuk akses relasi
        foreignKey: "id_transaksi", // Foreign key di tabel detail_transaksi
      });

      // Relasi ke tabel `categories` (opsional, jika id_category dihubungkan ke categories)
      detail_transaksi.belongsTo(models.category, {
        as: "category", // Alias untuk akses kategori produk
        foreignKey: "id_category",
      });
    }
  }
  detail_transaksi.init(
    {
      id_transaksi: DataTypes.INTEGER,
      product: DataTypes.STRING,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail_transaksi",
    }
  );
  return detail_transaksi;
};
