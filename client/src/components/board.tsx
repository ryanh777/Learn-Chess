import { useContext, useEffect, useState } from "react";
import BoardContext from "../LogicContext";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, samePosition, Piece } from "../constants";
import Tile from "./tile/tile";

interface tileInfo {
    key: string,
    image: string | undefined,
    number: number
}

interface Props {
    pieces: Piece[]
}

const Board = (props: Props) => {
    const [board, setBoard] = useState<tileInfo[]>([])

    useEffect(() => {
        let board: tileInfo[] = []
        for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
			for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
				const number = j + i + 2;
				const piece = props.pieces.find((p) =>
					samePosition(p.position, { x: i, y: j })
				);
				let image = piece ? piece.image : undefined;
                const tile: tileInfo = {
                    key: `${j},${i}`,
                    image: image,
                    number: number
                } 
                board.push(tile)
			}
		}
        setBoard(board)
    }, [props.pieces])

    return (
        <>
            {board.map(({key, image, number}) => {
					return <Tile key={key} image={image} number={number} />
                })
            }        
        </>
    )
}

export default Board;