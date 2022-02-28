import { Component } from "react";
import Tile from "../tile/tile";
import "./chessboard.css"
import {
    VERTICAL_AXIS,
    HORIZONTAL_AXIS,
    TILE_SIZE,
    Piece,
    PieceType,
    TeamType,
    initialBoardState,
    Position,
    samePosition,
  } from "../../constants";

// TODO
interface Props {
    idk?: string,
    board?: JSX.Element[]
}

interface States {
    pieces: Piece[]
}

// Extends "Component" to access componentDidMount() 
class Chessboard extends Component<Props, States> {
    constructor(props: Props) {
        super(props);
    }

    initializeBoard() {
         let board = []
         let pieces: Piece[] = JSON.parse(JSON.stringify(initialBoardState))

         for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
            for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
              const number = j + i + 2;
              const piece = pieces.find((p) =>
                samePosition(p.position, { x: i, y: j })
              );
              let image = piece ? piece.image : undefined;
        
              board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
            }
          }
        return board;
    }

    render() {
        return (
            <div id="chessboard">{this.initializeBoard()}</div>
        )
    }
}

export default Chessboard;