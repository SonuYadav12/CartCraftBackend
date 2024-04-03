const express = require("express");
const Product = require("../model/modelSchema");
const jwt = require("jsonwebtoken");
const UserSchema = require("../model/UserSchema");

const mainpage = (req, res) => {
  res.send("Hello world");
};

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let lastProductArray = products.slice(-1);
      let lastProduct = lastProductArray[0];
      id = lastProduct.id + 1;
    } else {
      id = 0;
    }
    const { name, image, category, new_price, old_price, date, available } =
      req.body;
    const product = await Product.create({
      id,
      name,
      image,
      category,
      new_price,
      old_price,
      date,
      available,
    });
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Failed to add product" });
  }
};

const removeProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Failed to remove product" });
  }
};

const allProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All products are fetched");
    res.send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

const SignUP=async (req, res) => {
  let check = await UserSchema.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "existing user" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const user = new UserSchema({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data={
    user:{
      id:user.id
    }
  }

  const token=jwt.sign(data,"secret_ecom");
  res.json({
    success:true,
    token
  })

};

const Login=async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (user) {
      const passwordCompare = req.body.password === user.password;
      if (passwordCompare) {
        const data = {
          user: {
            id: user.id
          }
        };
        const token = jwt.sign(data, "secret_token"); // Fixed typo
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: "Wrong Password" });
      }
    } else {
      res.json({ success: false, errors: "Wrong emailAddress" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
};

module.exports = {
  SignUP,
  Login,
  mainpage,
  addProduct,
  removeProduct,
  allProduct,
};
