const express = require("express");
const router = express.Router();
const controllers = require("../config/controllers");

router.get("/mainpage", controllers.mainpage);
router.post("/addproduct", controllers.addProduct);
router.post("/removeproduct", controllers.removeProduct);
router.get("/allproduct", controllers.allProduct);
router.post("/signup",controllers.SignUP);
router.post("/login",controllers.Login )

module.exports = router;
