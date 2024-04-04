const express = require("express");
const app = express();
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path"); // Import the path module
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
const storage = multer.memoryStorage(); // Use memory storage for file buffer
const upload = multer({ storage: storage });


app.post("/upload", upload.single("product"), async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save the uploaded file to the desired directory
    const localFilePath = path.join(__dirname, "upload/images", req.file.originalname);
    fs.writeFileSync(localFilePath, req.file.buffer);

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
      folder: 'uploads', // Optional folder in Cloudinary
      public_id: `image_${Date.now()}`, // Optional public ID, use a unique identifier
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(localFilePath);

    // Response with Cloudinary URL of the uploaded image
    res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: cloudinaryResult.secure_url // URL of the uploaded image from Cloudinary
    });
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    res.status(500).json({ message: "Error uploading image to Cloudinary" });
  }
});
// Route for other endpoints
app.use("/", route);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
