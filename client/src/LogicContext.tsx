import { Chess } from "chess.js";
import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Move, Orientation, User } from "./@constants";
import logicReducer from "./@reducers/logic";
import { LogicContextStateType, LogicContextActionType } from "./@types";

const initialState: LogicContextStateType = {
    user: {
        username: "",
        whiteRootID: "",
        blackRootID: ""
    },
    game: Chess(),
    boardOrientation: Orientation.white,
    prevMove: {
        move: "",
        parentID: "",
        childIDs: [],
        childMoves: []
    },
    isLearnState: false
}

const LogicContext = createContext<{
    state: LogicContextStateType, 
    dispatch: Dispatch<LogicContextActionType>
}>({
    state: initialState,
    dispatch: () => null
});

interface Props {
    children: ReactNode;
    user: User;
    prevMove: Move
}

export const LogicContextProvider = (props: Props) => {
    const initialStateWithUser = { ...initialState, user: props.user, prevMove: props.prevMove}
    const [state, dispatch] = useReducer(logicReducer, initialStateWithUser)

    return (
        <LogicContext.Provider value={{state, dispatch}}>{props.children}</LogicContext.Provider>
    )
}

export default LogicContext;