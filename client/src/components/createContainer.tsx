import { useContext, } from 'react'
import { Move } from '../@constants'
import { fetchMove, safeGameMutate, undo } from '../@helpers'
import LogicContext from '../LogicContext'
import FlipColorButton from './flipColorButton'
import GameHistoryNode from './gameHistoryNode'
import MoveButton from './moveButton'
import SaveButton from './save'
import { TiChevronLeft } from 'react-icons/ti'
import ResetButton from './resetButton'

const CreateContainer = () => {
   const {state, dispatch} = useContext(LogicContext)
   const { prevMove, game, } = state
  
   return (
      <div className='flex flex-col flex-grow ml-6'>
         <div className='flex flex-col justify-between flex-grow mb-5 shadow-inner rounded-3xl bg-bgsecondary'>
            {/* <div className='mt-3 ml-4'>Create Lines</div> */}
            <div className='flex items-center m-3 bg-bgtertiary justify-evenly basis-1/2 rounded-xl'>
               {prevMove.childData.map((child, index) => 
                  <MoveButton key={index} child={child}/>
               )}
            </div>
            {/* <div className='flex justify-center bg-bgtertiary'>{prevMove.move}</div> */}
            <div className='flex flex-wrap p-2 m-3 bg-bgtertiary basis-1/2 rounded-xl'>
               {/* {game.history({verbose: true}).filter((element, index) => index < game.history().length - 1).map((move, index, arr) =>  */}
               {game.history({verbose: true}).map((move, index, arr) => 
                  <>
                     {index % 2 === 0 &&  
                        <div className='ml-1 text-lg'>{index / 2 + 1}.</div>
                     }
                     <GameHistoryNode key={index} move={move} count={arr.length - index - 1}/>
                  </>
               )}
            </div>
         </div>
         <div className='flex h-24 p-3 bg-bgsecondary rounded-3xl'>
            <button className="flex items-center justify-center flex-grow mr-1 text-lg bg-button rounded-xl hover:bg-buttonHover" onClick={() => undo(1, game, prevMove, dispatch)}>{<TiChevronLeft size={40} />}</button>
            <ResetButton/>
            <SaveButton/>
            <FlipColorButton/>
            {/* <LearnStateButton/> */}
         </div>
      </div>
      
   )
}

export default CreateContainer