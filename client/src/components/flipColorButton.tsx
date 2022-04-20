import { useContext } from 'react'
import { Chess } from 'chess.js'
import { Orientation } from '../@constants'
import LogicContext from '../LogicContext'

interface Props {
   getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
}

const FlipColorButton = (props: Props): JSX.Element => {
   const {state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState} = state

  	return (
      <>
         <button onClick={
            async () => {
               if (isLearnState && boardOrientation === Orientation.white) {
                  const firstMove = await props.getBlackLearnStateFirstMove()
                  if (firstMove) {
                     const game = Chess()
                     game.move(firstMove.move)
                     dispatch({
                        type: "flip-black-learnstate", 
                        payload: {
                           game: game,
                           moveID: firstMove.id
                        }
                     })
                  }
                  return
               } 
               dispatch({type: "flip", payload: boardOrientation === Orientation.white ? user.whiteRootID : user.blackRootID})
            }
         }>Flip</button>
      </>
  	)
}

export default FlipColorButton