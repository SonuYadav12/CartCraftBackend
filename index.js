const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
dotenv.config();
const port = process.env.PORT || 5001;
connectDB();
const route = require("./routes/route");

app.use(express.json());
app.use(cors());

// Image storage engine
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post("/upload", upload.single("product"), (req, res) => {
  const imageBuffer = req.file.buffer; 
  res.json({
    success: 1,
    message: "Image uploaded successfully",
  });
});


app.post("/upload/multiple", upload.array("product", 10), (req, res) => {
 
  res.json({
    success: 1,
    message: "Multiple images uploaded successfully",
  });
});

app.use("/", route);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
