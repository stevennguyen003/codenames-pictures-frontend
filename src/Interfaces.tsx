export type Team = 'red' | 'blue';

export interface TurnData {
    currentTurn: Team;
    currentClue: string;
    clueNumber: number;
    correctCardsClicked: number;
    turnEnded: boolean;
}

export interface RoomDetails {
    gameLog: any[];
    users: any[];
    spectators: TeamMember[];
    teamRed: TeamMember[];
    teamBlue: TeamMember[];
    gameStarted: boolean;
    gameGrid?: GameCard[];
    currentTurnData?: TurnData | null;
    teamRedPoints: number | null;
    teamBluePoints: number | null;
}

export interface GameState {
    gameStarted: boolean;
    teamRedPoints: number | null;
    teamBluePoints: number | null;
    currentTurnData: TurnData | null;
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

export interface UserDetails {
    teamColor: 'red' | 'blue' | 'spectator';
    role: 'spymaster' | 'operator' | null;
}