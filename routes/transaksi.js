var express = require("express");
var router = express.Router();
const models = require("../models/index");
const { where, Op } = require("sequelize");
const jwtverify = require("../middleware/authMiddleware");
router.get("/data_pendapatan", async (req, res) => {
  try {
    const today = new Date();
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay()); // Set ke hari Minggu
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Tentukan akhir minggu ini (Sabtu atau hari ini jika minggu belum berakhir)
    const endOfThisWeek = new Date(startOfThisWeek);
    endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sabtu
    endOfThisWeek.setHours(23, 59, 59, 999);

    console.log("Start of This Week (local):", startOfThisWeek);
    console.log("End of This Week (local):", endOfThisWeek);
    const data = await models.transaksi.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfThisWeek, endOfThisWeek],
        },
      },
      attributes: ["total_pembelian"],
    });
    const totalPendapatan = await models.transaksi.sum("total_pembelian", {
      where: {
        createdAt: {
          [Op.between]: [startOfThisWeek, endOfThisWeek],
        },
      },
    });

    return res.status(200).json({
      responseCode: 200,
      data: data,
      totalPendapatan: totalPendapatan || 0,
    });
  } catch (error) {
    console.error(error);
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
    // if (
    //   !nominal_pembeyaran ||
    //   parseFloat(nominal_pembeyaran) < parseFloat(total_pembelian)
    // ) {
    //   return res.status(400).json({
    //     responseCode: 400,
    //     message: "Transaction failed: Payment is insufficient or missing",
    //   });
    // }

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
        price: detail.price,
        qty: detail.qty,
        id_kategory: detail.id_kategory,
      }));
      await models.detail_transaksi.bulkCreate(detailData);
      for (const detail of details) {
        const product = await models.product.findOne({
          where: { title: detail.product },
        });

        if (product) {
          // Kurangi stok produk berdasarkan qty
          if (product.stock >= detail.qty) {
            product.stock -= detail.qty;
            await product.save();
          } else {
            return res.status(400).json({
              responseCode: 400,
              message: `Stock is insufficient for product: ${detail.product}`,
            });
          }
        } else {
          return res.status(404).json({
            responseCode: 404,
            message: `Product not found: ${detail.product}`,
          });
        }
      }
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
router.get("/history", async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const history = await models.transaksi.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
      include: [
        {
          model: models.detail_transaksi,
          as: "details",
          attributes: ["product", "price", "qty"],
        },
      ],
      attributes: [
        "id",
        "no_meja",
        "id_kasir",
        "id_payment_method",
        "total_pembelian",
        "nominal_pembeyaran",
        "nominal_pengembalian",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      responseCode: 200,
      message: "Transaction history retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Error retrieving transaction history",
      error: error.message,
    });
  }
});

module.exports = router;
