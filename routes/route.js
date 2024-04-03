const express = require("express");
const router = express.Router();
const controllers = require("../config/controllers");

router.get("/mainpage", controllers.mainpage);
router.post("/addproduct", controllers.addProduct);
router.post("/removeproduct", controllers.removeProduct);
router.get("/allproduct", controllers.allProduct);
router.post("/signup",controllers.SignUP);
router.post("/login",controllers.Login )
router.get("/newcollection",controllers.newcollection )
router.get("/popwomen",controllers.popwomen )
router.post("/addtocart",controllers.fetchUser,controllers.addtocart);
router.post("/removefromcart",controllers.fetchUser,controllers.removefromcart);
router.post("/getcart",controllers.fetchUser,controllers.getcart);


module.exports = router;
