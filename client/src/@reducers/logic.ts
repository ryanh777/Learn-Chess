import { Chess, ChessInstance } from "chess.js";
import { Orientation } from "../@constants";
import { LogicContextActionType, LogicContextStateType } from "../@types";

const logicReducer = (
   state: LogicContextStateType,
   action: LogicContextActionType
) => {
   switch (action.type) {
      case "drop": {
         return {
            ...state,
            game: action.payload,
         };
      }
      case "game": {
         return {
            ...state,
            game: action.payload.game,
            currentMoveID: action.payload.moveID,
         };
      }
      case "reset-board": {
         return {
            ...state,
            game: Chess(),
            currentMoveID:
               state.boardOrientation === Orientation.white
                  ? state.user.whiteRootID
                  : state.user.blackRootID,
         };
      }
      case "flip": {
         return {
            ...state,
            game: Chess(),
            currentMoveID:
               state.boardOrientation === Orientation.white
                  ? state.user.blackRootID
                  : state.user.whiteRootID,
            boardOrientation:
               state.boardOrientation === Orientation.white
                  ? Orientation.black
                  : Orientation.white,
         };
      }
      case "flip-black-learnstate": {
         return {
            ...state,
            game: action.payload.game,
            boardOrientation:
               state.boardOrientation === Orientation.white
                  ? Orientation.black
                  : Orientation.white,
            currentMoveID: action.payload.moveID,
         };
      }
      case "mode": {
         return {
            ...state,
            game: Chess(),
            currentMoveID:
               state.boardOrientation === Orientation.white
                  ? state.user.blackRootID
                  : state.user.whiteRootID,
            isLearnState: !state.isLearnState,
         };
      }
      case "mode-black-learnstate": {
         return {
            ...state,
            game: action.payload.game,
            currentMoveID: action.payload.moveID,
            isLearnState: !state.isLearnState,
         };
      }
      case "auto-move": {
         return {
            ...state,
            game: action.payload.game,
            currentMoveID: action.payload.moveID,
         };
      }
   }
};

export default logicReducer;
