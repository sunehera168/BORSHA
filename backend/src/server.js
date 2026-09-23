const express = require("express");
const cors = require("cors");
const User = require("../models/User");
require("dotenv").config();

const sequelize = require("../config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root API
app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "BORSHA API is running",
    });
});

// Database connection and server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log("PostgreSQL database connected successfully.");

        app.listen(PORT, () => {
            console.log(`BORSHA API server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to PostgreSQL:", error.message);
    }
};

startServer();