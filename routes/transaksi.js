var express = require("express");
var router = express.Router();
const models = require("../models/index");
const { where } = require("sequelize");
const jwtverify = require("../middleware/authMiddleware");
router.get("/data_pendapatan", async (req, res) => {
  try {
    const today = new Date();
    const startOfThisWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const startOfLastWeek = new Date(
      startOfThisWeek.setDate(startOfThisWeek.getDate() - 7)
    );
    const endOfLastWeek = new Date(
      startOfThisWeek.setDate(startOfThisWeek.getDate() + 6)
    );
    const data = await models.transaksi.fineAll({
      where: {
        createdAt: {
          [Op.between]: [startOfLastWeek, endOfLastWeek],
        },
      },
      attributes: ["total_pembelian"],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});
router.post("/", jwtverify, async (req, res) => {
  try {
    const {
      no_meja,
      id_payment_method,
      total_pembelian,
      nominal_pembeyaran,
      nominal_pengembalian,
      details,
    } = req.body;
    const id_kasir = req.userId;
    if (
      !nominal_pembeyaran ||
      parseFloat(nominal_pembeyaran) < parseFloat(total_pembelian)
    ) {
      return res.status(400).json({
        responseCode: 400,
        message: "Transaction failed: Payment is insufficient or missing",
      });
    }

    const transaksi = await models.transaksi.create({
      no_meja,
      id_kasir,
      id_payment_method,
      total_pembelian,
      nominal_pembeyaran,
      nominal_pengembalian,
    });

    if (details && Array.isArray(details)) {
      const detailData = details.map((detail) => ({
        id_transaksi: transaksi.id,
        product: detail.product,
        prince: detail.prince,
        qty: detail.qty,
      }));
      await models.detail_transaksi.bulkCreate(detailData);
    }

    res.status(201).json({
      responseCode: 201,
      message: "Transaction and details created successfully",
      data: transaksi,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Error creating transaction",
      error: error.message,
    });
  }
});

module.exports = router;
