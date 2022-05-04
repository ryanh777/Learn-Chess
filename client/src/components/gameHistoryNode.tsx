import { ChessInstance, Move } from 'chess.js'
import { count } from 'console'
import { useContext } from 'react'
import { undo } from '../@helpers'
import LogicContext from '../LogicContext'

interface Props {
    move: Move,
    // onClick: (count: number) => Promise<void>,
    count: number
}

const GameHistoryNode = (props: Props) => {
  const {state, dispatch} = useContext(LogicContext)
  const {game, prevMove} = state

  const handleClick = () => { 
    if (props.count === 0) return
    undo(props.count, game, prevMove, dispatch)
  }

  return (
    <>
      {props.count === 0 ? 
        <div 
          className="px-1 mx-1 text-lg rounded-sm bg-button h-min">
          {props.move.san}
        </div>
        : 
        <div 
          className="mx-1 text-lg hover:cursor-pointer hover:text-white h-min" 
          onClick={handleClick}>
          {props.move.san}
        </div>
      }
    </>
    // <div 
    //   className="mx-1 text-lg hover:cursor-pointer hover:text-white" 
    //   onClick={handleClick}>
    //   {props.move.san}
    // </div>
  )
}

export default GameHistoryNode