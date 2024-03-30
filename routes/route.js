const express = require("express");
const router = express.Router();
const controllers = require("../config/controllers");

router.get("/mainpage", controllers.mainpage);
router.post("/addproduct", controllers.addProduct);
router.post("/removeproduct", controllers.removeProduct);
router.get("/allproduct", controllers.allProduct);

module.exports = router;
