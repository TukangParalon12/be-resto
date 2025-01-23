"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bahan_bakus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
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
      stock: {
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
    await queryInterface.dropTable("bahan_bakus");
  },
};
