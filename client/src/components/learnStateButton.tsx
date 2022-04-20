import { Chess } from 'chess.js'
import React, { Dispatch, MutableRefObject, SetStateAction, useContext, useState } from 'react'
import { Orientation, User } from '../@constants'
import LogicContext from '../LogicContext'

enum ButtonText {
   Learn = "Learn Mode",
   Create = "Create Mode"
}

interface Props {
   // user: User
   // isLearnState: boolean,
   // boardOrientation: Orientation,
   // currentMoveID: MutableRefObject<string>,
   // setIsLearnState: Dispatch<SetStateAction<boolean>>,
   // safeGameMutate: (modify: (game: ChessInstance) => void) => void
   getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
}

const LearnStateButton = (props: Props) => {
   const [buttonText, setButtonText] = useState<string>(ButtonText.Learn)
   const { state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState} = state

   const handleClick = async () => { 
      if (isLearnState) {
         setButtonText(ButtonText.Learn)
         // safeGameMutate((game) => game.reset())
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
      // props.setIsLearnState(isLearnState => !isLearnState)
      // props.boardOrientation === "white" ? 
      //    props.currentMoveID.current = props.user.whiteRootID : 
      //    props.currentMoveID.current = props.user.blackRootID

      dispatch({type: "mode"})
   }

   return (
      <button onClick={handleClick}>{buttonText}</button>
   )
}

export default LearnStateButton