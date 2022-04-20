import { Dispatch, MutableRefObject, useContext } from 'react'
import { ChildData, User } from '../constants'
import { Chess, ChessInstance } from 'chess.js'
import { getChildren } from '../helperFuncs'
import user from './user/user'
import { initialState, Orientation } from '../@constants'
import LogicContext from '../LogicContext'

interface Props {
   // user: User,
   // boardOrientation: "white" | "black",
   // isLearnState: boolean,
   // currentMoveID: MutableRefObject<string>,
   // setBoardOrientation: Dispatch<React.SetStateAction<"white" | "black">>,
   // safeGameMutate: (modify: (game: ChessInstance) => void) => void,
   getBlackLearnStateFirstMove: () => Promise<{move: string, id: string} | undefined>
}

const FlipColorButton = (props: Props): JSX.Element => {
   const {state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState} = state

   // const handleFlip = async () => { 
   //    // if (props.isLearnState && props.boardOrientation === "white") {
   //    //    const moveNode: ChildData = await getChildren(props.user.blackRootID)
   //    //    if (moveNode.ids.length === 0) { 
   //    //       alert("need saved black lines before learning")
   //    //       return
   //    //    }
   //    //    const randIndex = Math.floor(Math.random() * moveNode.ids.length)
   //    //    const randomOppMove: string = moveNode.moves[randIndex]
   //    //    props.safeGameMutate((game) => {
   //    //       game.reset()
   //    //       game.move(randomOppMove)
   //    //    })
   //    //    props.currentMoveID.current = moveNode.ids[randIndex]
   //    //    props.setBoardOrientation("black")
   //    // }
      
      
   //    // if (boardOrientation === "white") {
   //    //    if (isLearnState) {
   //    //       props.initLearnState("black")
   //    //    }
   //    //    props.setBoardOrientation("black")
   //    //    return
   //    // }
   //    // if (isLearnState) {
   //    //    props.initLearnState("white")
   //    // }
   //    // props.setBoardOrientation("white")
   //    if (isLearnState) {props.initLearnState(boardOrientation)} 
   //    dispatch({type: "flip"})
   // }

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