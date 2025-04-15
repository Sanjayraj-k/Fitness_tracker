import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { counts } from "../utils/data"; 
import CountsCard from "../Components/cards/Countscard";
import WeeklyStatCard from "../Components/cards/WeeklyStatCard";
import CategoryChart from "../Components/cards/Categorychart";
import WorkoutCard from "../Components/cards/Workoutcard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";

// Define a new simplified version of AddWorkout component directly in Dashboard
const AddWorkoutCard = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 6px;
  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const CardTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const WorkoutTextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  margin: 10px 0;
  resize: vertical;
  font-family: inherit;
`;

const AddButton = styled.button`
  border-radius: 10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 14px;
  padding: 10px 28px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? "0.8" : "1")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);

  const dashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const res = await getDashboardDetails(token);
      setData(res.data);
      console.log("Dashboard data:", res.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const res = await getWorkouts(token, "");
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
      console.log("Today's workouts:", res.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      alert("Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  const addNewWorkout = async () => {
    if (!workout.trim()) {
      alert("Please enter a workout.");
      return;
    }
    setButtonLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      await addWorkout(token, { workoutString: workout });
      await Promise.all([dashboardData(), getTodaysWorkout()]);
      setWorkout(""); // Clear input after success
    } catch (error) {
      console.error("Error adding workout:", error);
      alert("Failed to add workout. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  // Direct handler for workout text change
  const handleWorkoutChange = (e) => {
    setWorkout(e.target.value);
  };

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <FlexWrap>
              {counts.map((item) => (
                <CountsCard key={item.id} item={item} data={data} />
              ))}
            </FlexWrap>

            <FlexWrap>
              <WeeklyStatCard data={data} />
              <CategoryChart data={data} />
              
              {/* Replace AddWorkout with our inline implementation */}
              <AddWorkoutCard>
                <CardTitle>Add New Workout</CardTitle>
                <WorkoutTextArea
                  rows={10}
                  placeholder={`Enter in this format:
#Category
-Workout Name and your name
-Sets
-Reps
-Weight
-Duration`}
                  value={workout}
                  onChange={handleWorkoutChange}
                />
                <AddButton 
                  onClick={addNewWorkout}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? "Adding..." : "Add Workout"}
                </AddButton>
              </AddWorkoutCard>
            </FlexWrap>

            <Section>
              <Title>Today's Workouts</Title>
              <CardWrapper>
                {todaysWorkouts.length > 0 ? (
                  todaysWorkouts.map((workout) => (
                    <WorkoutCard workout={workout} />
                  ))
                ) : (
                  <div>No workouts for today.</div>
                )}
              </CardWrapper>
            </Section>
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;