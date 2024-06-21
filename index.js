const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3001;

// MongoDB connection
mongoose
  .connect("mongodb://0.0.0.0:27017/bharat")
  .then(() => {
    console.log("Connection to MongoDB successful");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Registration Schema
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Model based on registration schema
const Registration = mongoose.model("Registration", registrationSchema);

// Middleware to parse application/json and application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

// Route to handle registration form submission
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Registration.findOne({ email: email });
    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
      });
      await registrationData.save();
      res.redirect("/success");
    } else {
      res.status(400).send("User already exists");
    }
  } catch (error) {
    console.error("Error in registration:", error);
    res.redirect("/error");
  }
});

// Route to serve success.html
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

// Route to serve error.html
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
