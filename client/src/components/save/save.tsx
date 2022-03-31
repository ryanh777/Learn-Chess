import { ChildData, AppContextType, whiteBoardState, blackBoardState } from "../../constants"
import { postMove, getChildren } from "../../helperFuncs";
import { useContext } from "react";
import AppContext from "../../AppContext";

export default function SaveComponent() {
    const { 
        user, 
        isWhite, 
        moveList,
        setMoveList,
        setPieces
    } = useContext(AppContext) as AppContextType 

    async function createChild(parentID: string, move: string): Promise<string> {
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

    async function saveButtonClicked() {
		if (user) {
			let id = isWhite === true ? user.whiteRootID : user.blackRootID
			let childData: ChildData = await getChildren(id)

			console.log("movelist:", moveList)

			for (let i = 0; i < moveList.length; i++) {
				let hasChildren = (childData.moves.length > 0) ? true : false
				if (hasChildren) {
					let broken: boolean = false
					for (let j = 0; j < childData.moves.length; j++) {
						if (childData.moves[j] === moveList[i]) {
							// console.log("same move:", childData.moves[j])
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
			setMoveList([])
			isWhite === true ? setPieces(JSON.parse(JSON.stringify(whiteBoardState))) : setPieces(JSON.parse(JSON.stringify(blackBoardState)))
		}
	}
    return (
        <button onClick={saveButtonClicked}>save</button>
    )
}