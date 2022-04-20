import { useRef } from "react";
import { UserMove } from "../../@constants";
import { TILE_SIZE, Position, Piece, } from "../../constants";
import movePiece from "../../movePiece";
import Board from "../board";
import "./chessboard.css"

interface Props {
	pieces: Piece[],
	handleAfterMovePiece: (pieces: Piece[], userMove: string) => void
}

const Chessboard2 = (props: Props): JSX.Element => {
    // const { state, dispatch } = useContext(BoardContext)
    const grabPosition = useRef<Position>({ x: -1, y: -1})
    const activePiece = useRef<HTMLElement | null>(null)
    const chessboardRef = useRef<HTMLDivElement>(null)

    const grabPiece = (e: React.MouseEvent): void => {
		const element = e.target as HTMLElement;
		const chessboard = chessboardRef.current;
		if (element.classList.contains("chess-piece") && chessboard) {
			const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
			const grabY = Math.abs(
				Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE * 8)) / TILE_SIZE)
			);
			grabPosition.current = { x: grabX, y: grabY };

			const x = e.clientX - TILE_SIZE / 2;
			const y = e.clientY - TILE_SIZE / 2;
			element.style.position = "absolute";
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

			activePiece.current= element;
		}
	}

	const dragPiece = (e: React.MouseEvent): void => {
		const chessboard = chessboardRef.current;
		if (activePiece.current && chessboard) {
			const minX = chessboard.offsetLeft - (TILE_SIZE * .25);
			const minY = chessboard.offsetTop - (TILE_SIZE * .25);
			const maxX = chessboard.offsetLeft + chessboard.clientWidth - (TILE_SIZE * .75);
			const maxY = chessboard.offsetTop + chessboard.clientHeight - (TILE_SIZE * .75);
			const x = e.clientX - (TILE_SIZE * .50);
			const y = e.clientY - (TILE_SIZE * .50);
			activePiece.current.style.position = "absolute";

			//If x is smaller than minimum amount
			if (x < minX) {
				activePiece.current.style.left = `${minX}px`;
			}
			//If x is bigger than maximum amount
			else if (x > maxX) {
				activePiece.current.style.left = `${maxX}px`;
			}
			//If x is in the constraints
			else {
				activePiece.current.style.left = `${x}px`;
			}

			//If y is smaller than minimum amount
			if (y < minY) {
				activePiece.current.style.top = `${minY}px`;
			}
			//If y is bigger than maximum amount
			else if (y > maxY) {
				activePiece.current.style.top = `${maxY}px`;
			}
			//If y is in the constraints
			else {
				activePiece.current.style.top = `${y}px`;
			}
		}
	}

	const dropPiece = (e: React.MouseEvent): void => {
		const chessboard = chessboardRef.current;
		// const moves = movesRef.current;
		if (chessboard) {
			const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
			const y = Math.abs(
				Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE * 8)) / TILE_SIZE)
			);
			// movePiece(grabPosition, {x, y}, true)
			if (activePiece.current) {
				const updatedPieces: Piece[] | null = movePiece(grabPosition.current, { x, y }, props.pieces, true)
				if (!updatedPieces) {
					activePiece.current.style.position = "relative";
					activePiece.current.style.removeProperty("top");
					activePiece.current.style.removeProperty("left");
					activePiece.current = null
					return
				}
				const userMove: string = [grabPosition.current.x, grabPosition.current.y, x, y ].join("")
				props.handleAfterMovePiece(updatedPieces, userMove)
				activePiece.current = null
			}
		}
	}

    return (
        <>
            <div 
                onMouseDown={(e) => grabPiece(e)}
                onMouseMove={(e) => dragPiece(e)}
                onMouseUp={(e) => dropPiece(e)}
                id="chessboard" 
                ref={chessboardRef}
			>
                <Board pieces={props.pieces}/>   
            </div>
        </>
    )
}

export default Chessboard2;