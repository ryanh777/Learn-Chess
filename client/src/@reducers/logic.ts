import { Chess } from "chess.js";
import { appContextInitialState, Orientation } from "../@constants";
import { LogicContextActionType, LogicContextStateType } from "../@types";

const logicReducer = (
   state: LogicContextStateType,
   action: LogicContextActionType
) => {
   switch (action.type) {
      case "reset-state": {
         return appContextInitialState;
      }
      case "drop": {
         return {
            ...state,
            game: action.payload,
         };
      }
      case "update-game": {
         return {
            ...state,
            game: action.payload.game,
            prevMove: action.payload.move,
         };
      }
      case "update-prevMove": {
         return {
            ...state,
            prevMove: action.payload,
         };
      }
      case "reset-board": {
         return {
            ...state,
            game: Chess(),
            prevMove: action.payload,
         };
      }
      case "flip": {
         return {
            ...state,
            game: Chess(),
            prevMove: action.payload,
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
            prevMove: action.payload.move,
         };
      }
      case "mode": {
         return {
            ...state,
            game: Chess(),
            prevMove: action.payload,
            isLearnState: !state.isLearnState,
         };
      }
      case "mode-black-learnstate": {
         return {
            ...state,
            game: action.payload.game,
            prevMove: action.payload.move,
            isLearnState: !state.isLearnState,
         };
      }
      case "auto-move": {
         return {
            ...state,
            game: action.payload.game,
            prevMove: action.payload.move,
         };
      }
      // default => THROW NEW ERROR
   }
};

export default logicReducer;
