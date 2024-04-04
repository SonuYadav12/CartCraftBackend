const express = require("express");
const Product = require("../model/modelSchema");
const jwt = require("jsonwebtoken");
const UserSchema = require("../model/UserSchema");

// const mainpage = (req, res) => {
//   res.send("Hello world");
// };

const addProduct = async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 0;

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
    console.log("Product removed");
    res.json({ success: true, name: req.body.name });
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

const newcollection = async (req, res) => {
  try {
    let products = await Product.find({});
    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No products found" });
    }
    let newcoll = products.slice(1).slice(-8);
    res.json(newcoll);
  } catch (error) {
    console.error("Error fetching new collection:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const SignUP = async (req, res) => {
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

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({
    success: true,
    token,
  });
};

const Login = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ email: req.body.email });
    if (user) {
      const passwordCompare = req.body.password === user.password;
      if (passwordCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
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

const popwomen = async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No women's products found" });
    }
    let productArray = products.slice(0, 4);
    res.json(productArray);
  } catch (error) {
    console.error("Error fetching popular women's products:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ errors: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(401).json({ errors: "Please authenticate using a valid token" });
  }
};

const addtocart = async (req, res) => {
  console.log(req.body, req.user);
  try {
    let userdata = await UserSchema.findOne({ _id: req.user.id });
    userdata.cartData[req.body.itemId] += 1;
    await UserSchema.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userdata.cartData }
    );
    res.json({ success: true, message: "Item added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const removefromcart = async (req, res) => {
  console.log(req.body, req.user);
  try {
    let userdata = await UserSchema.findOne({ _id: req.user.id });
    if (userdata.cartData[req.body.itemId] > 0) {
      userdata.cartData[req.body.itemId] -= 1;
      await UserSchema.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userdata.cartData }
      );
      res.json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } else {
      res.json({ success: false, error: "Item not found in the cart" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getcart = async (req, res) => {
  let userdata = await UserSchema.findOne({ _id: req.user.id });
  res.json(userdata.cartData);
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(403).send('Forbidden');
    }
    req.user = user;
    next();
  });
};


module.exports = {
  SignUP,
  Login,
  // mainpage,
  addProduct,
  removeProduct,
  allProduct,
  newcollection,
  popwomen,
  addtocart,
  fetchUser,
  removefromcart,
  getcart,
  authenticateToken
};
