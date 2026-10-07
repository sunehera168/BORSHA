const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("../config/database");

const User = require("../models/User");
const FloodReport = require("../models/FloodReport");

const userRoutes = require("../routes/userRoutes");
const floodReportRoutes = require("../routes/floodReportRoutes");

const app = express();


// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Routes
// ===============================

// User routes
app.use("/api/users", userRoutes);

// Flood report routes
app.use("/api/flood-reports", floodReportRoutes);


// ===============================
// Root API
// ===============================

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "BORSHA API is running",
    });
});


// ===============================
// Database Connection & Server
// ===============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        // Test PostgreSQL connection
        await sequelize.authenticate();

        console.log(
            "PostgreSQL database connected successfully."
        );

        // Synchronize database tables
        await sequelize.sync();

        console.log(
            "Database tables synchronized successfully."
        );

        // Start server
        app.listen(PORT, () => {
            console.log(
                `BORSHA API server running on port ${PORT}`
            );
        });

    } catch (error) {

        console.error(
            "Unable to connect to PostgreSQL:",
            error.message
        );

    }
    
};

startServer();