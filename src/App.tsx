import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './SocketContext';
import HomePage from './Pages/HomePage';
import RoomPage from './Pages/RoomPage';

function App() {
    return (
        <SocketProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/room/:roomCode" element={<RoomPage />} />
                </Routes>
            </HashRouter>
        </SocketProvider>
    );
}

export default App;
