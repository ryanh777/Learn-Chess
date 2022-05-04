import { Chess } from 'chess.js'
import { ReactNode } from 'react'
import { FC, useContext, useState } from 'react'
import { AppState, Move, Orientation, } from '../@constants'
import { getBlackLearnStateFirstMove, getRootMove } from '../@helpers'
import LogicContext from '../LogicContext'

interface Props {
   state: AppState,
   icon: ReactNode
}

const AppStateButton = (props: Props) => {
   // const [buttonText, setButtonText] = useState<string>(ButtonText.Learn)
   const { state, dispatch} = useContext(LogicContext)
   const { user, boardOrientation, isLearnState, prevMove} = state

   const handleClick = async () => { 
      const rootMove: Move = await getRootMove(boardOrientation, user)
      if (isLearnState) {
         // setButtonText(ButtonText.Learn)
         dispatch({type: "mode", payload: rootMove})
         return
      }
      if (rootMove.childData.length === 0) {
         alert(`need line for ${boardOrientation} before learning`)
         return
      }
      // setButtonText(ButtonText.Create)
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
      // <button className="flex-grow text-lg bg-button rounded-xl hover:bg-buttonHover" onClick={handleClick}>{buttonText}</button>
     
      <>
         {
         props.state === "create" && !isLearnState || props.state === "learn" && isLearnState
         ? 
         <div 
            className='flex items-center justify-center h-16 m-2 rounded-xl bg-buttonHover'
            onClick={handleClick}>
            {props.icon}
         </div> 
         :
         <div 
            className='flex items-center justify-center h-16 m-2 transition-all duration-100 ease-linear cursor-pointer rounded-3xl bg-button hover:bg-buttonHover hover:rounded-xl'
            onClick={handleClick}>
            {props.icon}
         </div>
         }
      </>
      // <div 
      //    className='flex items-center justify-center h-16 m-2 transition-all duration-100 ease-linear cursor-pointer rounded-3xl bg-button hover:bg-buttonHover hover:rounded-xl'
      //    onClick={penis}>
      //    {props.icon}
      // </div>
   )
}
export default AppStateButton