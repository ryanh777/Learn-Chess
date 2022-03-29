import { ChildData } from "./constants";

export async function postMove(object: Object) {
  return fetch("/data/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  }).then((res) => res.json());
}

export async function getChildren(id: string): Promise<ChildData> {
  let childData: ChildData = { ids: [""], moves: [""] };
  await fetch(`/data/${id}`)
    .then((res) => res.json())
    .then((data) => {
      childData.ids = data.childIDs;
      childData.moves = data.childMoves;
    });
  return childData;
}
