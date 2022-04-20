// import { Position } from "./constants";

export const initialState = {
   username: "",
   password: "",
   error: "",
   isLoading: false,
   isLoggedIn: false,
};

export interface User {
   username: string;
   whiteRootID: string;
   blackRootID: string;
}

export interface Move {
   move: string;
   parentID: string;
   childIDs: string[] | [];
   childMoves: string[] | [];
}

export enum AppState {
   Learn,
   Create,
}

export enum Orientation {
   white = "white",
   black = "black",
}

export interface MovePieceReturnData {
   valid: boolean;
   appState: AppState;
   data: {};
}

export interface ChildData {
   ids: string[];
   moves: string[];
}

// export interface UserMove {
//    initialPosition: Position;
//    finalPosition: Position;
// }
