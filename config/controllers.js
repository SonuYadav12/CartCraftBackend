const express = require("express");
const Product = require("../model/modelSchema");

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

module.exports = {
  mainpage,
  addProduct,
  removeProduct,
  allProduct,
};
