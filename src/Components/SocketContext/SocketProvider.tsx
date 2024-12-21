import { useState, useRef, useCallback, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SocketContext from './SocketContext';
import { setupSocketListeners } from '../../Sockets/Listeners/socketListeners';

// Socket Provider 
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // First initializing the socket
    const initSocket = useCallback(() => {

        // Attempts to find an existing session, if not, we create one
        const existingSessionId = localStorage.getItem('sessionId') || uuidv4();
        localStorage.setItem('sessionId', existingSessionId);
        setSessionId(existingSessionId);

        // New Socket
        const newSocket = io('http://localhost:4000', { 
            withCredentials: true,
            query: { sessionId: existingSessionId }
        });

        // Setting up socket
        setupSocketListeners(newSocket, existingSessionId);
        setSocket(newSocket);
        socketRef.current = newSocket;
    }, []);

    // Handle reconnection persistence
    const reconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        initSocket();
    }, [initSocket]);

    useEffect(() => {
        initSocket();
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [initSocket]);

    return (
        <SocketContext.Provider value={{ socket, sessionId, reconnect }}>
            {children}
        </SocketContext.Provider>
    );
};