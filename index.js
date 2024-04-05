const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path"); 
const connectDB = require("./db/connectDB");
const cloudinary = require("cloudinary").v2; 
dotenv.config();
const port = process.env.PORT || 5001;
connectDB();
const route = require("./routes/route");

app.use(express.json());
app.use(cors());

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image storage engine using Multer
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


app.post("/upload", upload.single("product"), async (req, res) => {
  try {
   
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    
    const localFilePath = path.join(__dirname, "upload/images", req.file.originalname);
    fs.writeFileSync(localFilePath, req.file.buffer);

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
      folder: 'uploads', 
      public_id: `image_${Date.now()}`, 
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(localFilePath);

    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url 
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading image to Cloudinary" });
  }
});

app.use("/api", route);

app.use('/testing', async (req, res) => {
  res.json('Hello World');
});

app.listen(port, () => {
  console.log("Server running on port " + port);
});