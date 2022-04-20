import { ChessInstance } from "chess.js";
import { Move, Orientation, User } from "./@constants";

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
   const randomIndex = Math.floor(Math.random() * move.childIDs.length);
   return fetchMove(move.childIDs[randomIndex]);
};

export const getBlackLearnStateFirstMove = async (
   user: User
): Promise<Move | undefined> => {
   const blackRoot: Move = await fetchMove(user.blackRootID);
   if (blackRoot.childIDs.length === 0) {
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
