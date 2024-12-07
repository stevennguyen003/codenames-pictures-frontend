import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

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
      <h1>CodeNames</h1>
    </div>
  );
}

export default App;
