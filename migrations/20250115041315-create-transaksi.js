'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      no_meja: {
        type: Sequelize.INTEGER
      },
      id_kasir: {
        type: Sequelize.INTEGER
      },
      id_payment_method: {
        type: Sequelize.INTEGER
      },
      total_pembelian: {
        type: Sequelize.STRING
      },
      nominal_pembeyaran: {
        type: Sequelize.STRING
      },
      nominal_pengembalian: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksis');
  }
};