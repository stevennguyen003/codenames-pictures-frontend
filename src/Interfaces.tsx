export interface RoomDetails {
    gameLog: any[];
    users: any[];
    spectators: TeamMember[];
    teamRed: TeamMember[];
    teamBlue: TeamMember[];
    gameStarted: boolean;
    gameGrid?: GameCard[];
    currentTurn?: 'red' | 'blue';
}

export interface TeamMember {
    nickname: string;
    id: string;
    role: 'spectator' | 'operator' | 'spymaster';
}

export interface GameCard {
    image: string;
    type: 'red' | 'blue' | 'neutral' | 'assassin';
    revealed: boolean;
}