import { useContext, useRef, useState } from "react";
import Tile from "../tile/tile";
import Referee from "../../referee/Referee";
import UserComponent from "../user/user"
import "./chessboard.css"
import {
	VERTICAL_AXIS,
	HORIZONTAL_AXIS,
	TILE_SIZE,
	Piece,
	PieceType,
	TeamType,
	whiteBoardState,
	blackBoardState,
	Position,
	samePosition,
	AppContextType,
	ChildData
} from "../../constants";
import { postMove, getChildren } from "../../helperFuncs";
import AppContext from "../../AppContext";
import SaveComponent from "../save/save";

export default function Chessboard() {
	const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
	const [promotionPawn, setPromotionPawn] = useState<Piece>()
	const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 })
	const [learnState, setLearnState] = useState<Boolean>(false)
	const { 
		user, 
		isWhite, 
		flipColor, 
		currentMoveID, 
		setCurrentMoveID,
		pieces,
		setPieces,
		moveList, 
		setMoveList
	} = useContext(AppContext) as AppContextType
	const [modeButtonText, setModeButtonText] = useState<String>("learn")
	const chessboardRef = useRef<HTMLDivElement>(null)
	const modalRef = useRef<HTMLDivElement>(null)
	const referee = new Referee()

	function grabPiece(e: React.MouseEvent) {
		const element = e.target as HTMLElement;
		const chessboard = chessboardRef.current;
		if (element.classList.contains("chess-piece") && chessboard) {
			const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
			const grabY = Math.abs(
				Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE * 8)) / TILE_SIZE)
			);
			setGrabPosition({ x: grabX, y: grabY });

			const x = e.clientX - TILE_SIZE / 2;
			const y = e.clientY - TILE_SIZE / 2;
			element.style.position = "absolute";
			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

			setActivePiece(element);
		}
	}

	function dragPiece(e: React.MouseEvent) {
		const chessboard = chessboardRef.current;
		if (activePiece && chessboard) {
			const minX = chessboard.offsetLeft - (TILE_SIZE * .25);
			const minY = chessboard.offsetTop - (TILE_SIZE * .25);
			const maxX = chessboard.offsetLeft + chessboard.clientWidth - (TILE_SIZE * .75);
			const maxY = chessboard.offsetTop + chessboard.clientHeight - (TILE_SIZE * .75);
			const x = e.clientX - (TILE_SIZE * .50);
			const y = e.clientY - (TILE_SIZE * .50);
			activePiece.style.position = "absolute";

			//If x is smaller than minimum amount
			if (x < minX) {
				activePiece.style.left = `${minX}px`;
			}
			//If x is bigger than maximum amount
			else if (x > maxX) {
				activePiece.style.left = `${maxX}px`;
			}
			//If x is in the constraints
			else {
				activePiece.style.left = `${x}px`;
			}

			//If y is smaller than minimum amount
			if (y < minY) {
				activePiece.style.top = `${minY}px`;
			}
			//If y is bigger than maximum amount
			else if (y > maxY) {
				activePiece.style.top = `${maxY}px`;
			}
			//If y is in the constraints
			else {
				activePiece.style.top = `${y}px`;
			}
		}
	}

	function dropPiece(e: React.MouseEvent) {
		const chessboard = chessboardRef.current;
		// const moves = movesRef.current;
		if (chessboard) {
			const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
			const y = Math.abs(
				Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE * 8)) / TILE_SIZE)
			);
			// movePiece(grabPosition, {x, y}, true)
			if (activePiece) {
				const wasValidMove = movePiece(grabPosition, { x, y }, true)
				if (!wasValidMove) {
					activePiece.style.position = "relative";
					activePiece.style.removeProperty("top");
					activePiece.style.removeProperty("left");
				}
				setActivePiece(null)
			}
		}
	}

	function movePiece(initialPosition: Position, finalPosition: Position, userDidMove: boolean): boolean {
		// console.log("currentMoveID on move:", currentMoveID)
		const currentPiece = pieces.find((p) =>
			samePosition(p.position, initialPosition)
		);

		if (currentPiece) {
			const validMove = referee.isValidMove(
				initialPosition,
				finalPosition,
				currentPiece.type,
				currentPiece.team,
				pieces
			);

			if (validMove) {
				//UPDATES THE PIECE POSITION
				//AND IF A PIECE IS ATTACKED, REMOVES IT
				const updatedPieces = pieces.reduce((results, piece) => {
					if (samePosition(piece.position, initialPosition)) {
						// //SPECIAL MOVE
						// piece.enPassant =
						//   Math.abs(initialPosition.y - finalPosition.y) === 2 &&
						//   piece.type === PieceType.PAWN;

						piece.position.x = finalPosition.x;
						piece.position.y = finalPosition.y;

						let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

						if (finalPosition.y === promotionRow && piece.type === PieceType.PAWN) {
							modalRef.current?.classList.remove("hidden");
							setPromotionPawn(piece);
						}
						results.push(piece);
					} else if (!samePosition(piece.position, finalPosition)) {
						// if (piece.type === PieceType.PAWN) {
						//   piece.enPassant = false;
						// }
						results.push(piece);
					}

					return results;
				}, [] as Piece[]);

				const userMove: string = [initialPosition.x, initialPosition.y, finalPosition.x, finalPosition.y].join("")
				if (learnState) {
					if (userDidMove) {
						moveOpponentPiece(userMove)
					}
					// if (user && learnState && userDidMove) {
					// if (user && learnState) {
				} else {
					// moveList.push(userMove)
					setMoveList([...moveList, userMove])
				}
				const textDiv = document.getElementById('text')
				if (textDiv) {
					textDiv.textContent = "Piece moved from x: " + initialPosition.x + " y: " + initialPosition.y + " to x: " + finalPosition.x + " y: " + finalPosition.y;
				}
				setPieces(updatedPieces)
				return true
			}
		}
		return false
	}

	async function switchModes() {
		if (learnState === false) {
			if (await rootHasChildren(isWhite)) {
				setModeButtonText('enter lines')
				initLearnState(isWhite)
			} else {
				alert(`must create lines for ${isWhite} before learning`)
			}
		} else {
			setModeButtonText('learn')
			if (isWhite === true) {
				setPieces(JSON.parse(JSON.stringify(whiteBoardState)))
			} else {
				setPieces(JSON.parse(JSON.stringify(blackBoardState)))
			}
		}
		setLearnState(!learnState)
	}

	async function moveOpponentPiece(userMove: string) {
		if (currentMoveID) {
			const childData: ChildData = await getChildren(currentMoveID)
			let oppMoveID: string = ""
			for (let i in childData.moves) {
				if (childData.moves[i] === userMove) {
					oppMoveID = childData.ids[i]
					break
				}
			}
			if (oppMoveID === "") {
				endOfLine("incorrect move")
				return
			}
			const oppData: ChildData = await getChildren(oppMoveID)
			if (!oppData.ids.length) {
				endOfLine("nice job")
				return
			}
			const randIndex = pickRandomChildAndMove(oppData)

			const oppChildData: ChildData = await getChildren(oppData.ids[randIndex])
			// console.log("nextMoves:", oppChildData.moves)
			if (!oppChildData.moves.length) {
				endOfLine("nice job")
				return
			}
		} else {
			console.log("currentMoveID is null")
		}
	}

	function pickRandomChildAndMove(moveNode: ChildData): number {
		const randIndex = Math.floor(Math.random() * moveNode.ids.length)
		const randomOppMove: string = moveNode.moves[randIndex]
		const initialX: number = +randomOppMove[0]
		const initialY: number = +randomOppMove[1]
		const finalX: number = +randomOppMove[2]
		const finalY: number = +randomOppMove[3]
		movePiece({ x: initialX, y: initialY }, { x: finalX, y: finalY }, false)
		setCurrentMoveID(moveNode.ids[randIndex])
		return randIndex
	}

	async function initLearnState(isWhite: boolean) {
		if (user) {
			if (isWhite) {
				setPieces(JSON.parse(JSON.stringify(whiteBoardState)))
				setCurrentMoveID(user.whiteRootID)
			} else {
				// pickRandomChildAndMove(await getChildren(user.blackRootID))
				const moveNode = await getChildren(user.blackRootID)
				const randIndex = Math.floor(Math.random() * moveNode.ids.length)
				const randomOppMove: string = moveNode.moves[randIndex]
				const initialX: number = +randomOppMove[0]
				const initialY: number = +randomOppMove[1]
				const finalX: number = +randomOppMove[2]
				const finalY: number = +randomOppMove[3]

				const tempPieces: Piece[] = JSON.parse(JSON.stringify(blackBoardState))
				const updatedPieces = tempPieces.reduce((results, piece) => {
					if (samePosition(piece.position, { x: initialX, y: initialY })) {
						piece.position.x = finalX;
						piece.position.y = finalY;
						results.push(piece);
					} else if (!samePosition(piece.position, { x: finalX, y: finalY })) {
						results.push(piece);
					}
					return results;
				}, [] as Piece[]);

				setPieces(updatedPieces)
				setCurrentMoveID(moveNode.ids[randIndex])
			}
		} else {
			console.log("ERROR: user is undefined (initLearnState)")
		}
	}

	function endOfLine(message: string) {
		alert(message)
		if (user) {
			const currID = isWhite === true ? user.whiteRootID : user.blackRootID
			setCurrentMoveID(currID)
			initLearnState(isWhite)
		}
	}

	async function rootHasChildren(userIsWhite: boolean): Promise<boolean> {
		if (user) {
			const rootID: string = userIsWhite === true ? user.whiteRootID : user.blackRootID
			const rootData: ChildData = await getChildren(rootID)
			return !rootData.ids.length ? false : true
		}
		return false
	}

	async function flipUserColor() {
		if (user) {
			if (learnState) {
				if (!await rootHasChildren(!isWhite)) {
					alert(`must create lines for ${!isWhite} before learning`)
					return
				}
				initLearnState(!isWhite)
			} else {
				isWhite === false ? setPieces(JSON.parse(JSON.stringify(whiteBoardState))) : setPieces(JSON.parse(JSON.stringify(blackBoardState)))
			}
			const rootID = isWhite === false ? user?.whiteRootID : user?.blackRootID
			setCurrentMoveID(rootID)
			flipColor()
		} 
	}

	function initializeBoard() {
		let board = []
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

	return (
		<>
			<UserComponent/>
			<div
				onMouseDown={(e) => grabPiece(e)}
				onMouseMove={(e) => dragPiece(e)}
				onMouseUp={(e) => dropPiece(e)}
				id="chessboard"
				ref={chessboardRef}
			>
				{initializeBoard()}
			</div>
			<div id="moves">
				<SaveComponent/>
				<button onClick={switchModes}>{modeButtonText}</button>
				<button onClick={flipUserColor}>flip</button>
			</div>
			<div id="text">
				Move a piece
			</div>
		</>
	)
}