import { Chess } from 'chess.js'
import { useContext, useState } from 'react'
import { Orientation, } from '../@constants'
import LogicContext from '../LogicContext'

enum ButtonText {
   Learn = "Learn Mode",
   Create = "Create Mode"
}

interface Props {
   getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
}

const LearnStateButton = (props: Props) => {
   const [buttonText, setButtonText] = useState<string>(ButtonText.Learn)
   const { state, dispatch} = useContext(LogicContext)
   const { boardOrientation, isLearnState} = state

   const handleClick = async () => { 
      if (isLearnState) {
         setButtonText(ButtonText.Learn)
      } else {
         setButtonText(ButtonText.Create)
         if (boardOrientation === Orientation.black) {
            const firstMove: { move: string; id: string; } | undefined = await props.getBlackLearnStateFirstMove()
            if (!firstMove) {return}
            const game = Chess()
            game.move(firstMove.move)
            dispatch({
               type: "mode-black-learnstate", 
               payload: {
                  game: game,
                  moveID: firstMove.id
               }
            })
            return
         }
      }
      dispatch({type: "mode"})
   }
   return (
      <button onClick={handleClick}>{buttonText}</button>
   )
}
export default LearnStateButton