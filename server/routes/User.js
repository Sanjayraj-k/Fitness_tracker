import express from "express";
import { UserRegister, Userlogin, getUserDashboard,getWorkoutsByDate,addWorkout } from "../controllers/user.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

// User signup route
router.post("/signup", UserRegister);
// User login route
router.post("/login", Userlogin);
// User dashboard route with authentication middleware
router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);
console.log("User routes loaded");

export default router;