import React, { useContext } from 'react'
import LogicContext from '../LogicContext'
import ChessboardContainer from './chessboard'
import CreateContainer from './createContainer'

const MainContent = () => {
    const { state } = useContext(LogicContext)
    const { isLearnState } = state
    return (
        <>
            {
                isLearnState 
                ? 
                <div className='flex justify-center flex-grow'>
                    <ChessboardContainer/>
                </div>
                : 
                <div className="flex flex-grow">
                    <CreateContainer/>
                    <ChessboardContainer/>
                </div>
            }
        </>
        
    )
}

export default MainContent