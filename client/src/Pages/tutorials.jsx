import React from 'react';
import './tutorial.css';
import chest from '../images/chest.jpg';
import tricpes from '../images/tricpes.jpg'
import biceps from '../images/biceps.jpg';
import shoulder from '../images/shoulder.webp';
import leg from '../images/leg.jpg';
import lat from '../images/lat.webp';
const WorkoutTutorial = () => {
  // Workout data array
  const workouts = [
    {
      id: 1,
      name: 'Chest Workout',
      image: chest,
      videoUrl: 'https://youtu.be/ChDeUAJc9bE?si=-rKjaAw4bqqTbClr'
    },
    {
      id: 2,
      name: 'Triceps Workout',
      image: tricpes,
      videoUrl: 'https://youtu.be/SuajkDYlIRw?si=R3r7wVam31YUmbk-'
    },
    {
      id: 3,
      name: 'Biceps Workout',
      image: biceps,
      videoUrl: 'https://youtu.be/2S_9dQylItg?si=suiURcin4sAk9Xse'
    },
    {
      id: 4,
      name: 'Shoulders Workout',
      image: shoulder,
      videoUrl: 'https://youtu.be/sUNv3uHAP6I?si=0SAn4f-m7_Ng-n55'
    },
    {
      id: 5,
      name: 'Legs Workout',
      image: leg,
      videoUrl: 'https://youtu.be/DpIeBMgh2OA?si=Gcx_Gpz_oWml0FT8'
    },
    {
      id: 6,
      name: 'Back Workout',
      image: lat,
      videoUrl: 'https://youtu.be/zgfcOWuTeYA?si=_BXrbumLd3r_Uku3'
    }
  ];

  return (
    <div className="workout-tutorial">
      <header className="tutorial-header">
        <h1>Fitness Workout Tutorials</h1>
        <p>Learn proper techniques for each muscle group with our expert guides</p>
      </header>
      
      <div className="workout-grid-three-col">
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <div className="workout-image-container">
              <img 
                src={workout.image} 
                alt={workout.name} 
                className="workout-image"
                loading="lazy"
              />
              <div className="workout-overlay">
                <h3>{workout.name}</h3>
              </div>
            </div>
            <a
              href={workout.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="video-button"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
      
      <footer className="tutorial-footer">
        <p>For more workout routines and fitness tips, visit our full training program.</p>
      </footer>
    </div>
  );
};

export default WorkoutTutorial;