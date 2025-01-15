var express = require("express");
var router = express.Router();
const models = require("../models/index");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtverify = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const { where } = require("sequelize");

// Function for login rate limiting
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: {
    error: "Too many login attempts. Please try again after 1 minute.",
  },
});

/* GET users listing. */
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const { role, name, password } = req.body;
    const hashedPaswword = await bcrypt.hash(password, 10);
    const make_data = await models.users.create({
      role: role,
      name,
      password: hashedPaswword,
    });
    res
      .status(201)
      .json({ data: make_data, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await models.users.findOne({ where: { name } });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(404).json({ error: "password failed" });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, "lucky");
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Login failed" });
  }
});
router.get("/show_data", jwtverify, async (req, res) => {
  try {
    const data = await models.users.findOne({
      where: { id: req.userId },
      attributes: ["id", "name", "role"],
    });
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ responseCode: 400, message: error.message });
  }
});

module.exports = router;
