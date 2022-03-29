import { createContext, useState } from "react";
import { AppContextType, User, Piece, whiteBoardState } from "./constants"; 

const AppContext = createContext<AppContextType | null>(null);

export const ContextProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const saveUser = (user: User) => {
        setUser(user)
    }
    const removeUser = () => {
        setUser(null)
    }

    const [isWhite, setIsWhite] = useState<boolean>(true)
    const flipColor = () => {
        setIsWhite(!isWhite)
    }

    const [currentMoveID, setCurrMoveID] = useState<string | null>(null)
    const setCurrentMoveID = (moveID: string) => {
        setCurrMoveID(moveID)
    }

    const [moveList, saveMoveList] = useState<string[]>([])
    const setMoveList = (moveList: string[]) => {
        saveMoveList(moveList)
    }

	const [pieces, savePieces] = useState<Piece[]>(JSON.parse(JSON.stringify(whiteBoardState)))
    const setPieces = (pieces: Piece[]) => {
        savePieces(pieces)
    }

    return (
        <AppContext.Provider value={{
            user, saveUser, removeUser,
            isWhite, flipColor,
            currentMoveID, setCurrentMoveID,
            moveList, setMoveList,
            pieces, setPieces
        }}>{children}</AppContext.Provider>
    )
};

export default AppContext;