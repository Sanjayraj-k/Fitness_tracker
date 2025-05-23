import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/user.js";
import Workout from "../models/workout.js";

dotenv.config();

export const UserRegister = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        const { email, password, name, img } = req.body;

        if (!email || !password || !name) {
            return next(createError(400, "Email, password, and name are required"));
        }

        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return next(createError(409, "User email already exists"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            img,
        });

        const savedUser = await newUser.save();

        const JWT_SECRET = process.env.JWT_SECRET || "9fb275dc4669a53bd3151d9ec955d6450d65ea3ae97f89a4650cb68549a607928c88dcdbaf28dea5b9017a1447d89bc4f9037d90b8eef0068faf5d6597bce129";
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
            expiresIn: "9999 years",
        });

        return res.status(200).json({ token, user: savedUser });
    } catch (err) {
        next(err);
    }
};

export const Userlogin = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return next(createError(400, "Email and password are required"));
        }

        const user = await User.findOne({ email }).exec();
        if (!user) {
            return next(createError(404, "No user found with this email"));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(401, "Incorrect password"));
        }

        const JWT_SECRET = process.env.JWT_SECRET || "9fb275dc4669a53bd3151d9ec955d6450d65ea3ae97f89a4650cb68549a607928c88dcdbaf28dea5b9017a1447d89bc4f9037d90b8eef0068faf5d6597bce129";
        const token = jwt.sign({ id: user._id }, JWT_SECRET, {
            expiresIn: "9999 years",
        });

        return res.status(200).json({ token, user });
    } catch (err) {
        next(err);
    }
};

export const getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).exec();
        if (!user) {
            return next(createError(404, "User not found"));
        }

        const currentDateFormatted = new Date();
        const startToday = new Date(
            currentDateFormatted.getFullYear(),
            currentDateFormatted.getMonth(),
            currentDateFormatted.getDate()
        );
        const endToday = new Date(
            currentDateFormatted.getFullYear(),
            currentDateFormatted.getMonth(),
            currentDateFormatted.getDate() + 1
        );

        const totalCaloriesBurnt = await Workout.aggregate([
            { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
            {
                $group: {
                    _id: null,
                    totalCaloriesBurnt: { $sum: "$caloriesBurned" },
                },
            },
        ]);

        const totalWorkouts = await Workout.countDocuments({
            user: userId,
            date: { $gte: startToday, $lt: endToday },
        });

        const avgCaloriesBurntPerWorkout =
            totalCaloriesBurnt.length > 0 && totalWorkouts > 0
                ? totalCaloriesBurnt[0].totalCaloriesBurnt / totalWorkouts
                : 0;

        const categoryCalories = await Workout.aggregate([
            { $match: { user: user._id, date: { $gte: startToday, $lt: endToday } } },
            {
                $group: {
                    _id: "$category",
                    totalCaloriesBurnt: { $sum: "$caloriesBurned" },
                },
            },
        ]);

        const pieChartData = categoryCalories.map((category, index) => ({
            id: index,
            value: category.totalCaloriesBurnt,
            label: category._id || "Uncategorized",
        }));

        const weeks = [];
        const caloriesBurnt = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(currentDateFormatted.getTime() - i * 24 * 60 * 60 * 1000);
            weeks.push(`${date.getDate()}th`);

            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

            const weekData = await Workout.aggregate([
                {
                    $match: {
                        user: user._id,
                        date: { $gte: startOfDay, $lt: endOfDay },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCaloriesBurnt: { $sum: "$caloriesBurned" },
                    },
                },
            ]);

            caloriesBurnt.push(weekData.length > 0 ? weekData[0].totalCaloriesBurnt : 0);
        }

        return res.status(200).json({
            totalCaloriesBurnt: totalCaloriesBurnt.length > 0 ? totalCaloriesBurnt[0].totalCaloriesBurnt : 0,
            totalWorkouts,
            avgCaloriesBurntPerWorkout,
            totalWeeksCaloriesBurnt: {
                weeks,
                caloriesBurned: caloriesBurnt,
            },
            pieChartData,
        });
    } catch (err) {
        next(err);
    }
};
export const getWorkoutsByDate = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const user = await User.findById(userId);
      let date = req.query.date ? new Date(req.query.date) : new Date();
      if (!user) {
        return next(createError(404, "User not found"));
      }
      const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
      );
  
      const todaysWorkouts = await Workout.find({
        userId: userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      });
      const totalCaloriesBurnt = todaysWorkouts.reduce(
        (total, workout) => total + workout.caloriesBurned,
        0
      );
  
      return res.status(200).json({ todaysWorkouts, totalCaloriesBurnt });
    } catch (err) {
      next(err);
    }
  };
  export const addWorkout = async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const { workoutString } = req.body;
      if (!workoutString) {
        return next(createError(400, "Workout string is missing"));
      }
      // Split workoutString into lines
      const eachworkout = workoutString.split(";").map((line) => line.trim());
      // Check if any workouts start with "#" to indicate categories
      const categories = eachworkout.filter((line) => line.startsWith("#"));
      if (categories.length === 0) {
        return next(createError(400, "No categories found in workout string"));
      }
  
      const parsedWorkouts = [];
      let currentCategory = "";
      let count = 0;
  
      // Loop through each line to parse workout details
      await eachworkout.forEach((line) => {
        count++;
        if (line.startsWith("#")) {
          const parts = line?.split("\n").map((part) => part.trim());
          console.log(parts);
          if (parts.length < 5) {
            return next(
              createError(400, `Workout string is missing for ${count}th workout`)
            );
          }
  
          // Update current category
          currentCategory = parts[0].substring(1).trim();
          // Extract workout details
          const workoutDetails = parseWorkoutLine(parts);
          if (workoutDetails == null) {
            return next(createError(400, "Please enter in proper format "));
          }
  
          if (workoutDetails) {
            // Add category to workout details
            workoutDetails.category = currentCategory;
            parsedWorkouts.push(workoutDetails);
          }
        } else {
          return next(
            createError(400, `Workout string is missing for ${count}th workout`)
          );
        }
      });
  
      // Calculate calories burnt for each workout
      await parsedWorkouts.forEach(async (workout) => {
        workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
        await Workout.create({ ...workout, user: userId });
      });
  
      return res.status(201).json({
        message: "Workouts added successfully",
        workouts: parsedWorkouts,
      });
    } catch (err) {
      next(err);
    }
  };

  const parseWorkoutLine = (parts) => {
    const details = {};
    console.log(parts);
    if (parts.length >= 5) {
      details.workoutName = parts[1].substring(1).trim();
      details.sets = parseInt(parts[2].split("sets")[0].substring(1).trim());
      details.reps = parseInt(
        parts[2].split("sets")[1].split("reps")[0].substring(1).trim()
      );
      details.weight = parseFloat(parts[3].split("kg")[0].substring(1).trim());
      details.duration = parseFloat(parts[4].split("min")[0].substring(1).trim());
      console.log(details);
      return details;
    }
    return null;
  };
  
  // Function to calculate calories burnt for a workout
  const calculateCaloriesBurnt = (workoutDetails) => {
    const durationInMinutes = parseInt(workoutDetails.duration);
    const weightInKg = parseInt(workoutDetails.weight);
    const caloriesBurntPerMinute = 5; // Sample value, actual calculation may vary
    return durationInMinutes * caloriesBurntPerMinute * weightInKg;
  };