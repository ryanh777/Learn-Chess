import { useContext } from 'react'
import { Chess } from 'chess.js'
import { Move, Orientation } from '../@constants'
import LogicContext from '../LogicContext'
import { getBlackLearnStateFirstMove, getRootMove } from '../@helpers'

// interface Props {
//    getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
// }

const FlipColorButton = (): JSX.Element => {
   const {state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState} = state

  	return (
      <>
         <button onClick={
            async () => {
               if (isLearnState && boardOrientation === Orientation.white) {
                  const firstMove: Move | undefined = await getBlackLearnStateFirstMove(user)
                  if (firstMove) {
                     const game = Chess()
                     game.move(firstMove.move)
                     dispatch({
                        type: "flip-black-learnstate", 
                        payload: {
                           game: game,
                           move: firstMove
                        }
                     })
                  }
                  return
               } 
               const rootMove: Move = await getRootMove(boardOrientation, user)
               dispatch({type: "flip", payload: rootMove})
            }
         }>Flip</button>
      </>
  	)
}

export default FlipColorButton