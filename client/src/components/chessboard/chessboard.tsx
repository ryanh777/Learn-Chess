import { useRef, useState } from "react";
import Tile from "../tile/tile";
import Referee from "../../referee/Referee";
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
  } from "../../Constants";

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [grabPosition, setGrabPosition] = useState<Position>({ x: -1, y: -1 });
  const [pieces, setPieces] = useState<Piece[]>(JSON.parse(JSON.stringify(initialBoardState)));
  const [modeButtonText, setModeButtonText] = useState<String>("learn");
  const chessboardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE*8)) / TILE_SIZE)
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
    // console.log("x: " + e.clientX + " y: " + e.clientY)
    const chessboard = chessboardRef.current;
    // console.log("offsettop: " + chessboard?.offsetTop + "offsetleft: " + chessboard?.offsetLeft)
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
    // console.log("tile size: " + TILE_SIZE)
    const chessboard = chessboardRef.current;
    // const moves = movesRef.current;
    if (chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / TILE_SIZE);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - (TILE_SIZE * 8)) / TILE_SIZE)
      );
      movePiece(grabPosition, {x, y})
    }
  }

  function movePiece(initialPosition: Position, finalPosition: Position) {
    if (activePiece) {
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

        const isEnPassantMove = referee.isEnPassantMove(
          initialPosition,
          finalPosition,
          currentPiece.type,
          currentPiece.team,
          pieces
        );

        const pawnDirection = currentPiece.team === TeamType.OUR ? 1 : -1;

        if (isEnPassantMove) {
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, initialPosition)) {
              piece.enPassant = false;
              piece.position.x = finalPosition.x;
              piece.position.y = finalPosition.y;
              results.push(piece);
            } else if (!samePosition(piece.position, { x: finalPosition.x, y: finalPosition.y - pawnDirection })) {
                if (piece.type === PieceType.PAWN) {
                  piece.enPassant = false;
                }
                results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          // moveList.push([initialPosition.x, initialPosition.y, finalPosition.x, finalPosition.y]);
          setPieces(updatedPieces);

        } else if (validMove) {
          //UPDATES THE PIECE POSITION
          //AND IF A PIECE IS ATTACKED, REMOVES IT
          const updatedPieces = pieces.reduce((results, piece) => {
            if (samePosition(piece.position, initialPosition)) {
              //SPECIAL MOVE
              piece.enPassant =
                Math.abs(initialPosition.y - finalPosition.y) === 2 &&
                piece.type === PieceType.PAWN;
                
              piece.position.x = finalPosition.x;
              piece.position.y = finalPosition.y;

              let promotionRow = (piece.team === TeamType.OUR) ? 7 : 0;

              if(finalPosition.y === promotionRow && piece.type === PieceType.PAWN) {
                modalRef.current?.classList.remove("hidden");
                setPromotionPawn(piece);
              }
              results.push(piece);
            } else if (!samePosition(piece.position, finalPosition)) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false;
              }
              results.push(piece);
            }

            return results;
          }, [] as Piece[]);

          // if (modeButtonText === "enter lines") {
          //   setPieceMovedFlag(true);
          // }
          // if (learnState) {
          //   moveOpponentPiece();
          // } else {
          //   moveList.push([initialPosition.x, initialPosition.y, finalPosition.x, finalPosition.y]);
          // }
          // const textDiv = document.getElementById('text');
          // if (textDiv) {
          //   textDiv.textContent = "Piece moved from x: " + initialPosition.x + " y: " + initialPosition.y + " to x: " + finalPosition.x + " y: " + finalPosition.y;
          // }
          setPieces(updatedPieces);
        } else {
          console.log("why")
          //RESETS THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
      setActivePiece(null);
    }
  }

  function saveButtonClicked() {    
    console.log("save button clicked")
  }

  function switchModes() {
    console.log("switching modes..")
  }

  function initializeBoard() {
    console.log("initialized")
    let board = []
    // let pieces: Piece[] = JSON.parse(JSON.stringify(initialBoardState))

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
        <button onClick={saveButtonClicked}>save</button>
        <button onClick={switchModes}>{modeButtonText}</button>
      </div>
      <div id="text">
        Move a piece
      </div>
    </>
  )
    
}