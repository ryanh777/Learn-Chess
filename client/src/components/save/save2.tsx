import { ChildData, } from "../../@constants"
import { getChildren, postMove } from "../../helperFuncs";
import { useContext } from "react";
import LogicContext from "../../LogicContext";
import { safeGameMutate } from "../../@helpers";
import { Orientation } from "../../@constants";

const SaveButton = (): JSX.Element => {
    const { state, dispatch } = useContext(LogicContext)
    const { user, game, boardOrientation} = state

    const createChild = async (parentID: string, move: string): Promise<string> => {
		const newChild = {
			move: move,
			parentID: parentID
		}
		const id = await postMove(newChild)
		const childInfo = {
			id: id,
			move: move
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

        const moveList: string[] = game.history()
        let id: string = boardOrientation === "white" ? user.whiteRootID : user.blackRootID
        let childData: ChildData = await getChildren(id)

        for (let i = 0; i < moveList.length; i++) {
            let hasChildren: boolean = (childData.moves.length > 0) ? true : false
            if (hasChildren) {
                let broken: boolean = false
                for (let j = 0; j < childData.moves.length; j++) {
                    if (childData.moves[j] === moveList[i]) {
                        id = childData.ids[j]
                        childData = await getChildren(id)
                        broken = true
                        break
                    }
                }
                if (!broken) id = await createChild(id, moveList[i])
            } else {
                id = await createChild(id, moveList[i])
            }
        }
        dispatch({type: "game", payload: {
                game: safeGameMutate(game, (game) => game.reset()),
                moveID: boardOrientation === Orientation.white ? user.whiteRootID : user.blackRootID
            }
        })
    }

    return (
        <button onClick={handleSave}>Save</button>
    )
}   

export default SaveButton;