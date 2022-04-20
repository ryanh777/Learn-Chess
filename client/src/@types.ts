import { ChessInstance } from "chess.js";
import { Orientation, User } from "./@constants";
import { Piece } from "./constants";
import { Move } from "./@constants";

export type LoginStateType = {
   username: string;
   password: string;
   error: string;
   isLoading: boolean;
   isLoggedIn: boolean;
};

export type LoginActionType =
   | { type: "field"; fieldName: string; payload: string }
   | { type: "login" }
   | { type: "success" }
   | { type: "error" }
   | { type: "logout" };

export type ContextStateType = {
   pieces: Piece[];
   isWhite: boolean;
   currentMoveID: string;
   moveList: string[];
   isLearnState: boolean;
};

export type ContextActionType =
   | {
        type: "pieces";
        payload: {
           pieces: Piece[];
        };
     }
   | {
        type: "save-move";
        payload: {
           pieces: Piece[];
           move: string;
        };
     }
   | { type: "save-line" }
   | {
        type: "flip";
        payload: {
           currentMoveID: string;
        };
     };

export type LogicContextStateType = {
   user: User;
   game: ChessInstance;
   boardOrientation: Orientation;
   // prevMove: Move;
   currentMoveID: string;
   isLearnState: boolean;
};

export type LogicContextActionType =
   | { type: "drop"; payload: ChessInstance }
   | { type: "game"; payload: { game: ChessInstance; moveID: string } }
   | { type: "reset-board" }
   | { type: "flip"; payload: string }
   | {
        type: "flip-black-learnstate";
        payload: { game: ChessInstance; moveID: string };
     }
   | { type: "mode" }
   | {
        type: "mode-black-learnstate";
        payload: { game: ChessInstance; moveID: string };
     }
   | { type: "auto-move"; payload: { game: ChessInstance; moveID: string } };
