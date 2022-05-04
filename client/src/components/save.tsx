import { ChildData, Move} from "../@constants"
import { Move as moveChess } from "chess.js"
import { getChildren, postMove } from "../helperFuncs";
import { useContext } from "react";
import LogicContext from "../LogicContext";
import { getRootMove } from "../@helpers";
import { RiSave3Fill } from 'react-icons/ri'

const SaveButton = (): JSX.Element => {
    const { state, dispatch } = useContext(LogicContext)
    const { user, game, boardOrientation} = state

    const createChild = async (parentID: string, move: string, piece: string): Promise<string> => {
		const newChild = {
			move: move,
			parentID: parentID,
            piece: piece
		}
		const id = await postMove(newChild)
		const childInfo: ChildData = {
			id: id,
			move: move,
            piece: piece
		}
		await fetch(`/data/add/${parentID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(childInfo)
		})
			.then(res => res.json())
			.then(data => console.log("data:", data))
		return id;
	}

    const handleSave = async () => {
        if (game.history().length === 0) {
            console.log("must make a move before saving")
            return
        }

        const history: moveChess[] = game.history({verbose: true})
        let id: string = boardOrientation === "white" ? user.whiteRootID : user.blackRootID
        let childData: ChildData[] = await getChildren(id)
        console.log("childdata:", childData)

        for (let i = 0; i < history.length; i++) {
            let hasChildren: boolean = (childData.length > 0) ? true : false
            const piece: string = history[i].color.concat(history[i].piece)
            if (hasChildren) {
                let broken: boolean = false
                for (let j = 0; j < childData.length; j++) {
                    if (childData[j].move === history[i].san) {
                        id = childData[j].id
                        childData = await getChildren(id)
                        broken = true
                        break
                    }
                }
                if (!broken) id = await createChild(id, history[i].san, piece)
            } else {
                id = await createChild(id, history[i].san, piece)
            }
        }
        const rootMove: Move = await getRootMove(boardOrientation, user)
        dispatch({ type: "reset-board", payload: rootMove })
    }

    return (
        <button 
            className="flex items-center justify-center flex-grow mr-1 text-lg bg-button rounded-xl hover:bg-buttonHover"
            onClick={handleSave}
            >
            {<RiSave3Fill size={36}/>}
        </button>
    )
}   

export default SaveButton;