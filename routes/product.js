const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const model = require("../models");
const { fn, col, Op } = require("sequelize");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});
router.post("/add_kategory", async (req, res) => {
  try {
    const { category } = req.body;
    const newcategory = await model.kategory.create({ category });
    res.json({ message: "Category added successfully" });
  } catch (error) {
    res.json({ message: "Error adding category" });
  }
});
router.get("/show_categories", async (req, res) => {
  try {
    const categories = await model.kategory.findAll({
      attributes: ["id", "category"],
    });
    res.status(200).json({
      responseCode: 200,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Error fetching categories",
      error: error.message,
    });
  }
});
router.get("/popular", async (req, res) => {
  try {
    const popularProducts = await model.detail_transaksi.findAll({
      attributes: ["product", [fn("SUM", col("qty")), "qty"]],
      group: ["product"],
      order: [[fn("SUM", col("qty")), "DESC"]],
      limit: 3,
    });
    const productNames = popularProducts.map((item) => item.product);

    const productDetails = await model.product.findAll({
      where: {
        title: {
          [Op.in]: productNames, // Cari produk berdasarkan nama yang populer
        },
      },
      attributes: ["id", "title", "price", "img_product"],
    });

    // Gabungkan data total pembelian dengan detail produk
    const result = popularProducts.map((item) => {
      const productInfo = productDetails.find((p) => p.title === item.product);
      return {
        id: productInfo?.id || null,
        title: item.product,
        price: productInfo?.price || null,
        img_product: productInfo?.img_product
          ? "uploads/" + productInfo.img_product
          : null,
        qty: item.qty,
      };
    });

    res.status(200).json({
      responseCode: 200,
      message: "Popular products retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Error retrieving popular products",
      error: error.message,
    });
  }
});
router.put("/update_kategory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const existingCategory = await model.kategory.findByPk(id);
    if (!existingCategory) {
      return res.status(404).json({
        responseCode: 404,
        message: "Category not found",
      });
    }
    await existingCategory.update({ category });
    res.status(200).json({
      responseCode: 200,
      message: "Category updated successfully",
      data: existingCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 500,
      message: "Error updating category",
      error: error.message,
    });
  }
});

router.post("/add_product", upload.single("img_product"), async (req, res) => {
  try {
    const { title, price, category, stock } = req.body;
    const img_product = req.file ? req.file.filename : null;

    if (!img_product) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = await model.product.create({
      title,
      price,
      img_product,
      category,
      stock,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
});
router.get("/show_product", async (req, res) => {
  try {
    const products = await model.product.findAll({
      attributes: ["title", "price", "img_product", "category", "stock"],
    });
    updateproducts = products.map((product) => {
      if (product.img_product) {
        product.img_product = "uploads/" + product.img_product;
      }
      return product;
    });
    console.log(updateproducts);

    return res.status(200).json({
      responseCode: 200,
      data: updateproducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});
router.put(
  "/update_product/:id",
  upload.single("img_product"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, price, category, stock } = req.body;
      const img_product = req.file ? req.file.filename : null;
      const product = await model.product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (img_product && product.img_product) {
        const oldImagePath = path.resolve(
          __dirname,
          "../uploads",
          product.img_product
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.title = title || product.title;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      if (img_product) {
        product.img_product = img_product;
      }
      await product.save();
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating product" });
    }
  }
);
router.put("/update_product_discount/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock, discount, category, title } = req.body;
    const img_product = req.file ? req.file.filename : null;
    const product = await model.product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.price = price || product.price;
    product.title = title || product.title;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.discount = discount || product.discount;
    await product.save();
    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

module.exports = router;
