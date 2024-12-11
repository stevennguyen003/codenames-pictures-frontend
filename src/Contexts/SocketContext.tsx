import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    const initSocket = () => {
        const savedSocketId = localStorage.getItem('socketId'); // Get socket ID from localStorage

        if (!savedSocketId) {
            // If there's no saved socket ID, create a new socket connection
            const newSocket = io('http://localhost:4000', { secure: false });

            newSocket.on('connect', () => {
                console.log('Socket connected:', newSocket.id);
                // Save socket ID in localStorage
                if (newSocket.id) {
                    localStorage.setItem('socketId', newSocket.id);
                }
            });

            newSocket.on('disconnect', () => {
                console.log('Socket disconnected');
                // Optionally, remove socket ID from localStorage when disconnected
                localStorage.removeItem('socketId');
            });

            setSocket(newSocket);
        } else {
            // If there's a saved socket ID, try to reconnect
            const reconnectSocket = io('http://localhost:4000', { secure: false });
            reconnectSocket.io.opts.query = { socketId: savedSocketId }; // Optional: Send the socket ID if needed on the server side

            reconnectSocket.on('connect', () => {
                console.log('Reconnected socket:', reconnectSocket.id);
                setSocket(reconnectSocket);
            });

            reconnectSocket.on('disconnect', () => {
                console.log('Socket disconnected');
            });
        }
    };

    useEffect(() => {
        initSocket();

        // Clean up socket connection when component unmounts
        return () => {
            if (socket) {
                socket.disconnect();
                localStorage.removeItem('socketId'); // Clean up the socket ID on disconnect
                console.log('Socket disconnected and cleaned up');
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
