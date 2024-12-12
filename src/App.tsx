import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import RoomPage from './Pages/RoomPage';
import { SocketProvider } from './Contexts/SocketContext';

function App() {

  return (
    <div className="App">
      <SocketProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/room/:roomCode" element={<RoomPage />} />
            </Routes>
          </HashRouter>
      </SocketProvider>
    </div>
  );
}

export default App;
