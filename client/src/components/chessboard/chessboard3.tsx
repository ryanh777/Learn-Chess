import { MutableRefObject, useContext } from 'react'
import { Square, } from 'chess.js'
import { Chessboard } from "react-chessboard";
import LogicContext from '../../LogicContext';
import { safeGameMutate } from '../../@helpers';

interface Props {
   userDidMove: MutableRefObject<boolean>
}

const Chessboard3 = (props: Props) => {
   const { state, dispatch } = useContext(LogicContext)
   const { game, boardOrientation } = state

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