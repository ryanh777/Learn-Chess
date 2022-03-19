export default function Datatest() {
    const people = [ "ethan", "ryan", "hanna"]
    const rootID = "6232affa1e1dcfdba8be68ca"

    async function getChildren(id: string) {
        let ids: [string] | [] = []
        let names: [string] | [] = []
        await fetch(`/data/${id}`)
        .then(res => res.json())
        .then(data => {
            ids = data.childID
            names = data.childName
        })
        return {ids: ids, names: names}
    }

    // Creates new child and attaches _id to parent's children array
    async function patch(parentID: string, childname: string): Promise<string> {
        const newChild = {
            name: childname,
            parentID: parentID
        }
        let id = ""

        await fetch('/data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newChild),
        })
        .then(res => res.json())
        .then(data => id = data)

        const childInfo = {
            id: id,
            name: childname
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

    async function yoyo() {
        let childData: {ids: [], names: []} = await getChildren(rootID)
        let id = rootID;

        for(let i = 0; i < people.length; i++) {        
            let hasChildren = (childData.names.length > 0) ? true : false
            if (hasChildren) {
                for (let j = 0; j < childData.names.length; j++) {
                    if (childData.names[j] === people[i]) {
                        id = childData.ids[j]
                        childData = await getChildren(childData.ids[j])
                        break
                    }
                    id = await patch(id, people[i])
                }
            } else {
                id = await patch(id, people[i])
            }
        }        
    }

    async function byeHo(id: string) {
        const temp: {ids: [], names: []} = await getChildren(id) 
        for (let i = 0; i < temp.names.length; i++) {
            byeHo(temp.ids[i])
        }
        fetch(`/data/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => console.log("data:", data))
    }

    async function deleet() {
        const id = (document.getElementById('id') as HTMLInputElement).value;
        const child = await fetch(`/data/${id}`).then(res => res.json())

        const childInfo = {
            id: id,
            name: child.name
        }

        await fetch(`/data/remove/${child.parentID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(childInfo)
        })
        .then(res => res.json())
        .then(data => console.log("data:", data))

        byeHo(id)
    }

    return (
        <div>
            <input type="text" id="id" placeholder="ID to delete"></input>
            {/* <input type="text" id="childname" placeholder="Child Name"></input> */}
            <button onClick={ yoyo }>patch</button>
            <button onClick={ deleet }>delete</button>
        </div>
    )
}