import React, { useContext } from 'react'
import LogicContext from '../LogicContext'

const CreateContainer = () => {
  const {state, dispatch} = useContext(LogicContext)
  
  return (
    <div>CreateContainer</div>
  )
}

export default CreateContainer