import { Chess } from "chess.js";
import { LogicContextStateType } from "./@types";

export interface User {
   username: string;
   whiteRootID: string;
   blackRootID: string;
}

export interface Move2 {
   move: string;
   parentID: string;
   childIDs: string[] | [];
   childMoves: string[] | [];
}

export interface Move {
   move: string;
   parentID: string;
   piece: string;
   childData: {
      id: string;
      move: string;
      piece: string;
   }[];
}

export enum AppState {
   Learn = "learn",
   Create = "create",
}

export enum Orientation {
   white = "white",
   black = "black",
}

// export enum AuthType {
//    Login = "Login",
//    Register = "Register",
// }

// export interface MovePieceReturnData {
//    valid: boolean;
//    appState: AppState;
//    data: {};
// }

// export interface ChildData {
//    ids: string[];
//    moves: string[];
// }

export interface ChildData {
   id: string;
   move: string;
   piece: string;
}

export const loginInitialState = {
   username: "",
   password: "",
   confirmpassword: "",
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
      piece: "",
      childData: [],
   },
   isLearnState: false,
};
