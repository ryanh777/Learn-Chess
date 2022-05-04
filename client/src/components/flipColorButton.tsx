import { useContext } from 'react'
import { Chess } from 'chess.js'
import { Move, Orientation } from '../@constants'
import LogicContext from '../LogicContext'
import { getBlackLearnStateFirstMove, getRootMove } from '../@helpers'
import { FiRepeat } from 'react-icons/fi'

// interface Props {
//    getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
// }

const FlipColorButton = (): JSX.Element => {
   const {state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState} = state

  	return (
      <>
         <button
            className='flex items-center justify-center flex-grow mr-1 text-lg bg-button rounded-xl hover:bg-buttonHover' 
            onClick={
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
                  
                  if (boardOrientation === Orientation.white) {
                     dispatch({type: "flip", payload: await getRootMove(Orientation.black, user)})
                     return
                  }
                  dispatch({type: "flip", payload: await getRootMove(Orientation.white, user)})
               }
            }
         >
            {<FiRepeat size={32} />}
         </button>
      </>
  	)
}

export default FlipColorButton