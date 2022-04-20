import React from 'react'

interface Props {
    moveName: string
}

const MoveButton = (props: Props) => {
  return (
    <button>{props.moveName}</button>
  )
}

export default MoveButton