import './boardContainer.css'
import { useContext, useEffect, useRef } from 'react'
import Chessboard3 from '../chessboard/chessboard3'
import FlipColorButton from '../flipColorButton'
import LearnStateButton from '../learnStateButton'
import SaveButton from '../save/save2'
import LogicContext from '../../LogicContext'
import { ChildData, Move, Orientation } from '../../@constants'
import { fetchMove, getBlackLearnStateFirstMove, getRandomNextMove, getRootMove, safeGameMutate } from '../../@helpers'

const BoardContainer = () => {
   const { state, dispatch } = useContext(LogicContext)
   const { user, game, boardOrientation, isLearnState, prevMove } = state
   const userDidMove = useRef<boolean>(false)  
   
   const gameHasChanged = async () => { 
      if (isLearnState) {
         if (!userDidMove.current) { return }
         userDidMove.current = false
         const moveList: string[] = game.history()
         if (moveList.length === 0) { return }
         const lastMove = moveList[moveList.length - 1]
			let userMoveID: string = ""
			for (let i in prevMove.childMoves) {
				if (prevMove.childMoves[i] === lastMove) {
					userMoveID = prevMove.childIDs[i]
					break
				}
			}
			if (userMoveID === "") {
				endOfLine("incorrect move")
				return
			}
         const userMove: Move = await fetchMove(userMoveID)
			if (!userMove.childIDs.length) {
				endOfLine("nice job")
				return
			}
			const oppMove: Move = await getRandomNextMove(userMove)
			if (!oppMove.childMoves.length) {
				endOfLine("nice job")
				return
			}
         dispatch({type: "auto-move", payload: {
               game: safeGameMutate(game, (game) => { 
                  game.move(oppMove.move)
               }), 
               move: oppMove
            }
         })
      }
   }

   const endOfLine = async (message: string) => {
		alert(message)
      if (boardOrientation === Orientation.black) {
         const firstMove: Move | undefined = await getBlackLearnStateFirstMove(user)
         if (firstMove) {
            dispatch({
               type: "update-game",
               payload: {
                  game: safeGameMutate(
                     game,
                     (game) => {
                        game.reset()
                        game.move(firstMove.move)
                     }
                  ),
                  move: firstMove
               }
            })
         }
         return
      }
      const rootMove: Move = await getRootMove(boardOrientation, user)
      dispatch({type: "reset-board", payload: rootMove})
   }

   useEffect(() => {
      gameHasChanged()
   }, [game.fen()])

   return (
      <div className='board-container'>
         <Chessboard3 userDidMove={userDidMove}/>
         <SaveButton />
         <FlipColorButton/>
         <LearnStateButton/>
      </div>
   )
}

export default BoardContainer
