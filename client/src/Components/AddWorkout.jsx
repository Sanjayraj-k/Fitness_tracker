import React, { useState, useEffect } from "react";
import { addWorkout } from "./api"; // Import your API function

const ApiIntegratedWorkoutForm = () => {
  const [workout, setWorkout] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWorkoutChange = (e) => {
    setWorkout(e.target.value);
  };

  const handleAddWorkout = async () => {
    if (!workout.trim()) {
      alert("Please enter workout details");
      return;
    }

    setIsLoading(true);
    try {
      // Get token from localStorage or wherever you store it
      const token = localStorage.getItem("userToken");
      
      if (!token) {
        alert("You need to be logged in to add workouts");
        setIsLoading(false);
        return;
      }

      // Parse workout input
      const workoutData = parseWorkoutInput(workout);
      
      // Send to backend using your API
      await addWorkout(token, workoutData);
      
      // Clear the input after successful submission
      setWorkout("");
      alert("Workout added successfully!");
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse workout input from textarea
  const parseWorkoutInput = (input) => {
    const lines = input.trim().split('\n');
    let category = "";
    let name = "";
    let sets = "";
    let reps = "";
    let weight = "";
    let duration = "";

    // Extract data from formatted input
    lines.forEach(line => {
      if (line.startsWith('#')) {
        category = line.substring(1).trim();
      } else if (line.startsWith('-')) {
        const content = line.substring(1).trim();
        if (!name) name = content;
        else if (!sets) sets = content;
        else if (!reps) reps = content;
        else if (!weight) weight = content;
        else if (!duration) duration = content;
      }
    });

    return {
      category,
      name,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
      duration: parseInt(duration) || 0
    };
  };

  return (
    <div className="workout-form" style={{
      border: "1px solid #ccc",
      borderRadius: "14px",
      padding: "24px",
      boxShadow: "1px 6px 20px 0px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <div style={{ fontWeight: "600", fontSize: "16px", color: "#007bff" }}>
        Add New Workout
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label htmlFor="workout-input">Workout</label>
        <textarea
          id="workout-input"
          rows="10"
          value={workout}
          onChange={handleWorkoutChange}
          placeholder={`Enter in this format:
#Category
-Workout Name
-Sets
-Reps
-Weight
-Duration`}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical"
          }}
        />
      </div>
      
      <button
        onClick={handleAddWorkout}
        disabled={isLoading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "10px 28px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? "0.8" : "1",
          transition: "all 0.3s ease",
          fontWeight: "500"
        }}
      >
        {isLoading ? "Adding Workout..." : "Add Workout"}
      </button>
    </div>
  );
};

export default ApiIntegratedWorkoutForm;