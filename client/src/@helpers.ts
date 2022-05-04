import { ChessInstance } from "chess.js";
import { Move, Orientation, User } from "./@constants";
import { LogicContextActionType } from "./@types";

// export const UpdateAfterRenderEffect = (func: () => void, deps: any) => {
//    const hasMounted = useRef<boolean>(false);

//    useEffect(() => {
//       if (!hasMounted.current) {
//          console.log("mounting");
//          hasMounted.current = true;
//          return;
//       }
//       console.log("here");
//       func();
//    }, [deps]);
// };

export const safeGameMutate = (
   game: ChessInstance,
   modify: (game: ChessInstance) => void
): ChessInstance => {
   const update = { ...game };
   modify(update);
   return update;
};

export const fetchMove = async (id: string): Promise<Move> => {
   return fetch(`/data/${id}`).then((res) => res.json());
};

export const getRandomNextMove = async (move: Move): Promise<Move> => {
   const randomIndex = Math.floor(Math.random() * move.childData.length);
   return fetchMove(move.childData[randomIndex].id);
};

export const getBlackLearnStateFirstMove = async (
   user: User
): Promise<Move | undefined> => {
   const blackRoot: Move = await fetchMove(user.blackRootID);
   if (blackRoot.childData.length === 0) {
      alert("need saved black lines before learning");
      return;
   }
   return getRandomNextMove(blackRoot);
};

export const getRootMove = async (
   boardOrientation: Orientation,
   user: User
): Promise<Move> => {
   return boardOrientation === Orientation.white
      ? fetchMove(user.whiteRootID)
      : fetchMove(user.blackRootID);
};

export const undo = async (
   count: number,
   game: ChessInstance,
   prevMove: Move,
   dispatch: (value: LogicContextActionType) => void
): Promise<void> => {
   // const moveBeforeLast: Move = await fetchMove(prevMove.parentID)
   let lastMove: Move = await fetchMove(prevMove.parentID);
   for (let i = 0; i < count - 1; i++)
      lastMove = await fetchMove(lastMove.parentID);

   dispatch({
      type: "update-game",
      payload: {
         game: safeGameMutate(game, (game) => {
            for (let i = 0; i < count; i++) game.undo();
         }),
         move: lastMove,
      },
   });
};

// export const getPieceSVG = (piece: string) => {

//    switch(piece) {
//       case "wp": {
//          return {
//             <div></div>
//          }
//       //       <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="45" height="45">
//       //    <path
//       //    d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
//       //    style={{
//       //       opacity: '1',
//       //       fill: '#ffffff',
//       //       fillOpacity: '1',
//       //       fillRule: 'nonzero',
//       //       stroke: '#000000',
//       //       strokeWidth: '1.5',
//       //       strokeLinecap: 'round',
//       //       strokeLinejoin: 'miter',
//       //       strokeMiterlimit: '4',
//       //       strokeDasharray: 'none',
//       //       strokeOpacity: '1'
//       //    }}
//       //    />
//       // </svg>

//       }
//    }
// }
