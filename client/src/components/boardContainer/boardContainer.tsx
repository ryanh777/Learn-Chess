import './boardContainer.css'
import { useContext, useEffect, useRef } from 'react'
// import { ChildData, } from '../../constants'
import Chessboard3 from '../chessboard/chessboard3'
import FlipColorButton from '../flipColorButton'
import LearnStateButton from '../learnStateButton'
import SaveButton from '../save/save2'
import { getChildren } from '../../helperFuncs'
import LogicContext from '../../LogicContext'
import { ChildData, Orientation } from '../../@constants'
import { safeGameMutate } from '../../@helpers'

const BoardContainer = () => {
   const { state, dispatch } = useContext(LogicContext)
   const { user, game, boardOrientation, isLearnState, currentMoveID } = state
   const userDidMove = useRef<boolean>(false)   
   
   const gameHasChanged = async () => {
      if (isLearnState) {
         if (!userDidMove.current) { return }
         userDidMove.current = false
         const moveList: string[] = game.history()
         if (moveList.length === 0) { return }
         const lastMove = moveList[moveList.length - 1]
         const childData: ChildData = await getChildren(currentMoveID)
			let oppMoveID: string = ""
			for (let i in childData.moves) {
				if (childData.moves[i] === lastMove) {
					oppMoveID = childData.ids[i]
					break
				}
			}
			if (oppMoveID === "") {
				endOfLine("incorrect move")
				return
			}
			const oppData: ChildData = await getChildren(oppMoveID)
			if (!oppData.ids.length) {
				endOfLine("nice job")
				return
			}
			const randIndex = pickRandomChildAndMove(oppData)
			const oppChildData: ChildData = await getChildren(oppData.ids[randIndex])
			if (!oppChildData.moves.length) {
				endOfLine("nice job")
				return
			}
      }
   }

   const pickRandomNextMove = (moveNode: ChildData): {move: string, id: string} => {
      const randomIndex = Math.floor(Math.random() * moveNode.ids.length)
		return {move: moveNode.moves[randomIndex], id: moveNode.ids[randomIndex]}
   }

   const pickRandomChildAndMove = (moveNode: ChildData): number => {
      const randIndex = Math.floor(Math.random() * moveNode.ids.length)
		const randomOppMove: string = moveNode.moves[randIndex]
      dispatch({type: "auto-move", payload: {
            game: safeGameMutate(game, (game) => { 
               // if (reset) {game.reset()}
               game.move(randomOppMove)
            }), 
            moveID: moveNode.ids[randIndex]
         }
      })
      return randIndex
   }

   const getBlackLearnStateFirstMove = async (): Promise<{move: string, id: string} | undefined> => {
      const moveNode: ChildData = await getChildren(user.blackRootID)
      if (moveNode.ids.length === 0) { 
         alert("need saved black lines before learning")
         return
      }
      return pickRandomNextMove(moveNode)
   }

   const endOfLine = async (message: string) => {
		alert(message)
      if (boardOrientation === Orientation.black) {
         const firstMove = await getBlackLearnStateFirstMove()
         if (firstMove) {
            dispatch({
               type: "game",
               payload: {
                  game: safeGameMutate(
                     game,
                     (game) => {
                        game.reset()
                        game.move(firstMove.move)
                     }
                  ),
                  moveID: firstMove.id
               }
            })
         }
         return
      }
      dispatch({type: "reset-board"})
   }

   useEffect(() => {
      gameHasChanged()
   }, [game.fen()])

   return (
      <div className='board-container'>
         <Chessboard3 userDidMove={userDidMove}/>
         <SaveButton />
         <FlipColorButton getBlackLearnStateFirstMove={getBlackLearnStateFirstMove}/>
         <LearnStateButton getBlackLearnStateFirstMove={getBlackLearnStateFirstMove}/>
         {/* <Testcontext/> */}
      </div>
   )
}

export default BoardContainer
