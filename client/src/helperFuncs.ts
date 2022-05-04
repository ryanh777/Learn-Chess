import { ChildData } from "./@constants";

export async function postMove(data: Object) {
   return fetch("/data/", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
   }).then((res) => res.json());
}

export async function getChildren(id: string): Promise<ChildData[]> {
   let childData: ChildData[] = [];
   await fetch(`/data/${id}`)
      .then((res) => res.json())
      .then((data) => {
         childData = data.childData;
      });
   return childData;
}
