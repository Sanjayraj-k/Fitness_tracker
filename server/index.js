import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/user", UserRoutes);

// Error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Home route
app.get("/", async (req, res) => {
    res.status(200).json({
        message: "Hello developer from KEC AIML STUDENT",
    });
});

// MongoDB connection
const MONGO_URL = "mongodb+srv://sanjay:sanjayraj156@cluster0.65swz.mongodb.net/";

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("The database is connected");
    } catch (err) {
        console.error("Database connection error:", err);
        throw err; // Rethrow to handle in startServer
    }
};

// Start server
const startServer = async () => {
    try {
        await connectDB(); // Wait for DB connection before starting server
        app.listen(8080, () => {
            console.log("The server is running at port 8080");
        });
    } catch (err) {
        console.error("Server startup error:", err);
    }
};

startServer();