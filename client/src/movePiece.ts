import { Dispatch, useContext } from "react";
import { AppState, MovePieceReturnData } from "./@constants";
import { ContextStateType, ContextActionType } from "./@types";
import { Position, samePosition, Piece, ChildData } from "./constants";
import { getChildren } from "./helperFuncs";
import Referee from "./referee/Referee";

const movePiece = (
   initialPosition: Position,
   finalPosition: Position,
   pieces: Piece[],
   userDidMove: boolean
): Piece[] | null => {
   // const { pieces, isLearnState } = state;
   const referee = new Referee();
   // const userMove: string = [
   //    initialPosition.x,
   //    initialPosition.y,
   //    finalPosition.x,
   //    finalPosition.y,
   // ].join("");

   const currentPiece = pieces.find((p) =>
      samePosition(p.position, initialPosition)
   );

   if (currentPiece) {
      const validMove = referee.isValidMove(
         initialPosition,
         finalPosition,
         currentPiece.type,
         currentPiece.team,
         pieces
      );

      if (validMove) {
         //UPDATES THE PIECE POSITION
         //AND IF A PIECE IS ATTACKED, REMOVES IT
         return pieces.reduce((results, piece) => {
            if (samePosition(piece.position, initialPosition)) {
               // //SPECIAL MOVE
               // piece.enPassant =
               //   Math.abs(initialPosition.y - finalPosition.y) === 2 &&
               //   piece.type === PieceType.PAWN;

               piece.position.x = finalPosition.x;
               piece.position.y = finalPosition.y;

               // let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

               // if (finalPosition.y === promotionRow && piece.type === PieceType.PAWN) {
               // 	modalRef.current?.classList.remove("hidden");
               // 	setPromotionPawn(piece);
               // }
               results.push(piece);
            } else if (!samePosition(piece.position, finalPosition)) {
               // if (piece.type === PieceType.PAWN) {
               //   piece.enPassant = false;
               // }
               results.push(piece);
            }

            return results;
         }, [] as Piece[]);

         // const userMove: string = [
         //    initialPosition.x,
         //    initialPosition.y,
         //    finalPosition.x,
         //    finalPosition.y,
         // ].join("");
         // if (learnState) {
         // 	if (userDidMove) {
         // 		moveOpponentPiece(userMove)
         // 	}
         // } else {
         // 	setMoveList([...moveList, userMove])
         // }

         // setPieces(updatedPieces)

         // if (!isLearnState) {
         //    // dispatch({
         //    //    type: "save-move",
         //    //    payload: { pieces: updatedPieces, move: userMove },
         //    // });
         //    return {
         //       valid: true,
         //       appState: AppState.Create,
         //       data: { pieces: updatedPieces, move: userMove },
         //    };
         // }

         // if (userDidMove) {
         //    moveOpponentPiece();
         // }

         // // dispatch({ type: "pieces", payload: { pieces: updatedPieces } });
         // return {
         //    valid: true,
         //    appState: AppState.Learn,
         //    data: { pieces: updatedPieces },
         // };
      }
   }
   // return {
   //    valid: false,
   //    appState: AppState.Create,
   //    data: {},
   // };
   return null;
};

export default movePiece;

// const moveOpponentPiece = async () => {
//    const { currentMoveID } = state;
//    const childData: ChildData = await getChildren(currentMoveID);
//    let oppMoveID: string = "";
//    for (let i in childData.moves) {
//       if (childData.moves[i] === userMove) {
//          oppMoveID = childData.ids[i];
//          break;
//       }
//    }
//    if (oppMoveID === "") {
//       endOfLine("incorrect move");
//       return;
//    }
//    const oppData: ChildData = await getChildren(oppMoveID);
//    if (!oppData.ids.length) {
//       endOfLine("nice job");
//       return;
//    }
//    const randIndex = pickRandomChildAndMove(oppData);

//    const oppChildData: ChildData = await getChildren(oppData.ids[randIndex]);
//    // console.log("nextMoves:", oppChildData.moves)
//    if (!oppChildData.moves.length) {
//       endOfLine("nice job");
//       return;
//    }
// };

// function pickRandomChildAndMove(moveNode: ChildData): number {
//    const randIndex = Math.floor(Math.random() * moveNode.ids.length);
//    const randomOppMove: string = moveNode.moves[randIndex];
//    const initialX: number = +randomOppMove[0];
//    const initialY: number = +randomOppMove[1];
//    const finalX: number = +randomOppMove[2];
//    const finalY: number = +randomOppMove[3];
//    movePiece({ x: initialX, y: initialY }, { x: finalX, y: finalY }, false, state);
//    setCurrentMoveID(moveNode.ids[randIndex]);
//    return randIndex;
// }
