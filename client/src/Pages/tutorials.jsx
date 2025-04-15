import React from 'react';
import './tutorial.css';

const WorkoutTutorial = () => {
  // Workout data array
  const workouts = [
    {
      id: 1,
      name: 'Chest Workout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=SaF9Gm0yq0Q'
    },
    {
      id: 2,
      name: 'Triceps Workout',
      image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=6SS6k3aXA4s'
    },
    {
      id: 3,
      name: 'Biceps Workout',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo'
    },
    {
      id: 4,
      name: 'Shoulders Workout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo'
    },
    {
      id: 5,
      name: 'Legs Workout',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0'
    },
    {
      id: 6,
      name: 'Back Workout',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      videoUrl: 'https://www.youtube.com/watch?v=ROXyfu7uB2w'
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