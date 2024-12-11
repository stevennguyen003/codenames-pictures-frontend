import React, { createContext, useContext, useState, ReactNode } from "react";

interface NicknameContextType {
  nickname: string;
  setNickname: (nickname: string) => void;
}

// Create context with default values
const NicknameContext = createContext<NicknameContextType | undefined>(undefined);

// Provider component
export const NicknameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nickname, setNickname] = useState<string>("");

  return (
    <NicknameContext.Provider value={{ nickname, setNickname }}>
      {children}
    </NicknameContext.Provider>
  );
};

// Custom hook to use context
export const useNickname = (): NicknameContextType => {
  const context = useContext(NicknameContext);
  if (!context) {
    throw new Error("useNickname must be used within a NicknameProvider");
  }
  return context;
};
