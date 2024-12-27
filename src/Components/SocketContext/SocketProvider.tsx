import { useState, useRef, useCallback, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import SocketContext from './SocketContext';
import { setupSocketListeners } from '../../Sockets/Listeners/socketListeners';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    
    const initSocket = useCallback(() => {
        try {
            // Attempts to find an existing session, if not, we create one
            const existingSessionId = localStorage.getItem('sessionId') || uuidv4();
            localStorage.setItem('sessionId', existingSessionId);
            setSessionId(existingSessionId);

            // Enhanced socket configuration for deployment
            const newSocket = io(BACKEND_URL, {
                withCredentials: true,
                query: { sessionId: existingSessionId },
                transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
                reconnectionAttempts: 5, // Limit reconnection attempts
                reconnectionDelay: 1000, // Start with 1 second delay
                reconnectionDelayMax: 5000, // Maximum 5 seconds delay
                timeout: 20000, // Increase timeout for slower connections
                auth: {
                    sessionId: existingSessionId
                },
                // Handle CORS for different environments
                extraHeaders: {
                    "Access-Control-Allow-Origin": "*"
                }
            });

            // Enhanced error handling
            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnectionError(error.message);
            });

            newSocket.on('connect', () => {
                console.log('Socket connected successfully');
                setConnectionError(null);
            });

            // Setup other listeners
            setupSocketListeners(newSocket, existingSessionId);
            
            setSocket(newSocket);
            socketRef.current = newSocket;

        } catch (error) {
            console.error('Socket initialization error:', error);
            setConnectionError(error instanceof Error ? error.message : 'Unknown error');
        }
    }, []);

    const reconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        setConnectionError(null);
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
        <SocketContext.Provider value={{ 
            socket, 
            sessionId, 
            reconnect,
            connectionError // Expose error state to consumers
        }}>
            {children}
        </SocketContext.Provider>
    );
};