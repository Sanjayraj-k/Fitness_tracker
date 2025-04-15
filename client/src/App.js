import {React,useState} from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './utils/Themes';
import { BrowserRouter, Routes } from 'react-router-dom';
import Authentication from './Pages/Authentication';
import styled from 'styled-components';
import Navbar from './Components/Navbar';
import { Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Workout from './Pages/Workouts'; 
import Tutorials from './Pages/tutorials';
import Blogs from './Pages/Blogs';
import Contact from './Pages/contact';
import { useSelector } from "react-redux";



const Container = styled.div`
  /* Add your container styles here */
  width:100%;
  height:100%;
  display:flex;
  flex-direction:column;
  background: ${({theme})=>theme.bg};
  color: ${({theme})=>theme.text_primary};
  overflow-x:hidden;
  overflow-y:hidden;
  transition: all 0.25s ease;
`;

function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            <Navbar currentUser={currentUser} /> {/* Navbar should be outside of Routes */}
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/Workouts" exact element={<Workout />} />
              <Route path="/Tutorials" exact element={<Tutorials />} />
              <Route path="/Blogs" exact element={<Blogs />} />
              <Route path="/Contact" exact element={<Contact />} />
              <Route path="/Authentication" element={<Authentication />} />
            </Routes>
          </Container>
        ) : (
          <Container>
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}
export default App;