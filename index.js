const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Product = require("./model/modelSchema");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
dotenv.config();
const port = process.env.PORT || 5001;
connectDB();
const route = require("./routes/route");

app.use(express.json());
app.use(cors());

// Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating endpoint for uploading images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

app.post("/upload/multiple", upload.array("product", 10), (req, res) => {
  return res.send("Multiple files");
});

app.use("/", route);

app.listen(port, () => {
  console.log("Server Running on port " + port);
});
