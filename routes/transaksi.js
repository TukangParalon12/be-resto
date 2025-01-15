var express = require("express");
var router = express.Router();
const models = require("../models/index");
const { where } = require("sequelize");
router.post("/data_pendapatan", async (req, res) => {
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

module.exports = router;
