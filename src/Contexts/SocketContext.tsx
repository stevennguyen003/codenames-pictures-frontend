import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

// Define the shape of the context value
interface SocketContextType {
    socket: Socket | null;
    sessionId: string | null;
    reconnect: () => void;
}

// Create a context for the socket connection and session
const SocketContext = createContext<SocketContextType>({ 
    socket: null, 
    sessionId: null,
    reconnect: () => {}
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Initialize the socket connection and handle session persistence
    const initSocket = useCallback(() => {
        // Retrieve or generate session ID
        let existingSessionId = localStorage.getItem('sessionId');
        if (!existingSessionId) {
            existingSessionId = uuidv4();
            localStorage.setItem('sessionId', existingSessionId);
        }

        console.log("Existing Session ID: ", existingSessionId);

        setSessionId(existingSessionId);

        // Create a socket connection
        const newSocket = io('http://localhost:4000', { 
            withCredentials: true,
            query: { sessionId: existingSessionId }
        });

        // Authenticate session
        newSocket.on('connect', () => {
            newSocket.emit('authenticate', existingSessionId, (response: any) => {
                if (response.success) {
                    // Existing session, nickname already set
                    console.log('Authenticated with existing session');
                } else {
                    // New session generated
                    console.log('New session created');
                }
            });
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        setSocket(newSocket);
        socketRef.current = newSocket;
    }, []);

    // Reconnection method
    const reconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        initSocket();
    }, [initSocket]); 

    useEffect(() => {
        initSocket();

        // Clean up socket connection when component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                console.log('Socket disconnected and cleaned up');
            }
        };
    }, [initSocket]);

    return (
        <SocketContext.Provider value={{ socket, sessionId, reconnect }}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    
    // Check to ensure the hook is used within a SocketProvider
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    
    return context;
};