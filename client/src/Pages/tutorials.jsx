import React from 'react';
import './tutorial.css'; // Assuming a separate CSS file for styling

const workouts = [
  { name: 'Chest ', image: 'https://i.ytimg.com/vi/m52z1OC1tQo/maxresdefault.jpg' },
  { name: 'Triceps ', image: 'https://fitliferegime.com/wp-content/uploads/2021/06/Triceps-Pushdown.jpg' },
  { name: 'Biceps ', image: 'https://i.pinimg.com/originals/29/fc/22/29fc22ba068375a4baebdf3539607a11.jpg' },
  { name: 'shoulder ', image: 'https://th.bing.com/th/id/OIP.KbKD_Q2QoBCWFD3FaVRQ4QHaHa?rs=1&pid=ImgDetMain' },
  { name: 'Back ', image: 'https://th.bing.com/th/id/R.d678d36747c631b811cf4648c90dbee9?rik=WU%2bL7Ggp9PHoIA&riu=http%3a%2f%2fwww.yeahwetrain.com%2fupload%2f20180317152750uid1.jpg&ehk=v7tSk1TTI%2bR1l%2b2Bd%2fw40CCjQ%2b3cZGcO4vyhHZJ4vcc%3d&risl=&pid=ImgRaw&r=0' },
  { name: 'Legs ', image: 'https://i.pinimg.com/originals/0a/dc/b2/0adcb233e6dd0bc5f321258f525fc7a9.jpg' },
];

const Tutorial = () => {
  return (
    <div className="workout-container">
      <h1>Workout Types</h1>
      <div className="workout-grid">
        {workouts.map((workout, index) => (
          <div key={index} className="workout-card">
            <img src={workout.image} alt={workout.name} className="workout-image" />
            <h3>{workout.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;