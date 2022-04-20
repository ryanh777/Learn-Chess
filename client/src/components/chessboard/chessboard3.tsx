import React, { MutableRefObject, useContext, useState } from 'react'
import { Chess, Square, ChessInstance } from 'chess.js'
import { Chessboard } from "react-chessboard";
import LogicContext from '../../LogicContext';
import { safeGameMutate } from '../../@helpers';
import { Orientation, User } from '../../@constants';

interface Props {
   // game: ChessInstance,
   // safeGameMutate: (modify: (game: ChessInstance) => void) => void
   // boardOrientation: "white" | "black",
   // user: User
   userDidMove: MutableRefObject<boolean>
}

const Chessboard3 = (props: Props) => {
   const { state, dispatch } = useContext(LogicContext)
   const { game, boardOrientation } = state

   // const onDrop = (sourceSquare: Square, targetSquare: Square) => {
   //    let move = null;
   //    props.safeGameMutate((game) => {
   //      move = game.move({
   //        from: sourceSquare,
   //        to: targetSquare,
   //        promotion: "q", // always promote to a queen for example simplicity
   //      });
   //    });
   //    if (move === null) return false; // illegal move
   //    props.userDidMove.current = true
   //    return true;
   //  }

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
      let move = null;
      dispatch({ 
         type: "drop", 
         payload: safeGameMutate(game, (game) => {
            move = game.move({
               from: sourceSquare,
               to: targetSquare,
               promotion: "q", // always promote to a queen for example simplicity
            });
         }),
      })
      if (move === null) return false; // illegal move
      props.userDidMove.current = true
      return true;
    }

   return (
      <div>
         <Chessboard boardWidth={450} boardOrientation={boardOrientation} position={game.fen()} onPieceDrop={onDrop}/>
      </div>
   )
}

export default Chessboard3