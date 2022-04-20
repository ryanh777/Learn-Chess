import { Chess } from 'chess.js'
import { useContext, useState } from 'react'
import { Move, Orientation, } from '../@constants'
import { getBlackLearnStateFirstMove, getRootMove } from '../@helpers'
import LogicContext from '../LogicContext'

enum ButtonText {
   Learn = "Learn Mode",
   Create = "Create Mode"
}

const LearnStateButton = () => {
   const [buttonText, setButtonText] = useState<string>(ButtonText.Learn)
   const { state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState, prevMove} = state

   const handleClick = async () => { 
      const rootMove: Move = await getRootMove(boardOrientation, user)
      if (isLearnState) {
         setButtonText(ButtonText.Learn)
         dispatch({type: "mode", payload: rootMove})
         return
      }
      if (rootMove.childIDs.length === 0) {
         alert(`need line for ${boardOrientation} before learning`)
         return
      }
      setButtonText(ButtonText.Create)
      if (boardOrientation === Orientation.black) {
         const firstMove: Move | undefined = await getBlackLearnStateFirstMove(user)
         if (!firstMove) {return}
         const game = Chess()
         game.move(firstMove.move)
         dispatch({
            type: "mode-black-learnstate", 
            payload: {
               game: game,
               move: firstMove
            }
         })
         return
      }
      dispatch({type: "mode", payload: rootMove})
   }
   return (
      <button onClick={handleClick}>{buttonText}</button>
   )
}
export default LearnStateButton