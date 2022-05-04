import React, { useContext } from 'react'
import LogicContext from '../LogicContext'
import { AiOutlineClear } from 'react-icons/ai'
import { Orientation } from '../@constants'
import { fetchMove, getRootMove } from '../@helpers'

const ResetButton = () => {
    const {state, dispatch} = useContext(LogicContext)
    const { user, boardOrientation } = state

    const handleClick = async () => { 
        dispatch({ type: 'reset-board', payload: await getRootMove(boardOrientation, user)})
    }

    return (
        <button
            className="flex items-center justify-center flex-grow mr-1 text-lg bg-button rounded-xl hover:bg-buttonHover"
            onClick={handleClick}>
            {<AiOutlineClear size={36} />}
        </button>
    )
}

export default ResetButton