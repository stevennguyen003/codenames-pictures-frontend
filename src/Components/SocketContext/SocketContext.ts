import { createContext } from 'react';
import { Socket } from 'socket.io-client';

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

export default SocketContext;