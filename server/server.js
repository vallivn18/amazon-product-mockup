const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
// app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Connection code
mongoose
  .connect(
    "mongodb+srv://vallivn18:admin@cluster0.rwzyw.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Your app and routes code...

app.get("/hi", (req, res) => {
  res.json({ message: "Hi I am working" });
});

app.use("/api", productRoutes);
app.use("/api", cartRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
