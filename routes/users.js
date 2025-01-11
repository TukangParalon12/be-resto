var express = require("express");
var router = express.Router();
const models = require("../models/index");
const users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtverify = require("jsonwebtoken");

/* GET users listing. */
router.post("/make_data", async (req, res, next) => {
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

module.exports = router;
