import { Chess } from "chess.js";
import { LogicContextStateType } from "./@types";

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

export const loginInitialState = {
   username: "",
   password: "",
   error: "",
   isLoading: false,
   isLoggedIn: false,
};

export const appContextInitialState: LogicContextStateType = {
   user: {
      username: "",
      whiteRootID: "",
      blackRootID: "",
   },
   game: Chess(),
   boardOrientation: Orientation.white,
   prevMove: {
      move: "",
      parentID: "",
      childIDs: [],
      childMoves: [],
   },
   isLearnState: false,
};
