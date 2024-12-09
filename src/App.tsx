import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import HomePage from './Pages/HomePage';
import RoomPage from './Pages/RoomPage';

function App() {

  useEffect(() => {
    const socket = io('http://localhost:4000');

    // Listen for connection event
    socket.on('connect', () => {
      console.log('Successfully connected to the server!');
    });

    // You can also listen for custom events from the server
    socket.on('user connected', () => {
      console.log('A user has connected on the backend!');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/room/:roomCode" element={<RoomPage/>} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
