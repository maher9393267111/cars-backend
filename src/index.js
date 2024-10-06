"use strict";
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;
var morgan = require("morgan");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://maher:maher9326@cluster0.nf63j.mongodb.net/daraa-cars-app?retryWrites=true&w=majority",
    //daraa-cars-app
    // "mongodb+srv://vercel-admin-user:ztRS3ekeWCxTp951@cluster0.0a6ga.mongodb.net/tiendev",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Routes

// var cron = require('node-cron');

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');
// });

const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const brandRoutes = require("./routes/brand");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const newsletterRoutes = require("./routes/newsletter");
const productRoutes = require("./routes/product");
const dashboardRoutes = require("./routes/dashboard");
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const couponCodeRoutes = require("./routes/coupon-code");
const productReviewRoutes = require("./routes/product-review");
const reviewRoutes = require("./routes/review");
const wishlistRoutes = require("./routes/wishlist");
const OrderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment-intents");
const delete_fileRoutes = require("./routes/file-delete");
const shopRoutes = require("./routes/shop");
const payment = require("./routes/payment");
const currency = require("./routes/currencies");
const compaign = require("./routes/compaign");
const car = require("./routes/car");
const siteReview = require("./routes/siteViews");





//images uploader Router
const { fileRouter } = require("./routes/DigitalOceanUploader");

app.use("/api", homeRoutes);
app.use("/api", authRoutes);
app.use("/api", brandRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", newsletterRoutes);
app.use("/api", productRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", searchRoutes);
app.use("/api", userRoutes);
app.use("/api", cartRoutes);
app.use("/api", couponCodeRoutes);
app.use("/api", productReviewRoutes);
app.use("/api", reviewRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", OrderRoutes);
app.use("/api", paymentRoutes);
app.use("/api", delete_fileRoutes);
app.use("/api", shopRoutes);
app.use("/api", payment);
app.use("/api", currency);
app.use("/api", compaign);
app.use("/api", fileRouter);
app.use("/api", car);
app.use("/api", siteReview);






// GET API
app.get("/", (req, res) => {
  res.send("This is a GET API okseee");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
