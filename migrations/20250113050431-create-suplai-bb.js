"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("suplaiBBs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_sub: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "supliers", // Nama tabel referensi
          key: "id", // Kolom di tabel referensi
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      bahan_baku: {
        type: Sequelize.STRING,
      },
      harga: {
        type: Sequelize.INTEGER,
      },
      satuan: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("suplaiBBs");
  },
};
