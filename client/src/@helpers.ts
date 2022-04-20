import { ChessInstance } from "chess.js";
import { useContext, useEffect, useRef } from "react";
import LogicContext from "./LogicContext";

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
