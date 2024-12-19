import { useContext } from 'react';
import SocketContext from '../Components/SocketContext/SocketContext';

// Hook for socket context
export const useSocket = () => {
    const context = useContext(SocketContext);
    
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    
    return context;
};