import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState } from "react";
import DragDropItem from "./components/DragDropItem";
import Button from "./components/Button";
import AlertDismissable from "./components/AlertDismissable";
import Alert from "./components/Alert";

function App() {
  const ids = [
    "id1",
    "id2",
    "id3",
    "id4",
    "id5",
    "id6",
    "id7",
    "id8",
    "id9",
    "id10",
  ];
  const [isVisible, setIsVisible] = useState({
    id1: true,
    id2: true,
    id3: false,
    id4: false,
    id5: false,
    id6: false,
    id7: false,
    id8: false,
    id9: false,
    id10: false,
  });
  const [name, setName] = useState({
    id1: "Carrot",
    id2: "Steel",
    id3: "Ice",
    id4: "Iron",
    id5: "Diamond",
    id6: "Gold",
    id7: "Netherite",
    id8: "Wood",
    id9: "Stone",
    id10: "Cobblestone",
  });
  const [positions, setPositions] = useState({
    id1: { x: 0, y: 120 },
    id2: { x: 0, y: 150 },
    id3: { x: 0, y: 180 },
    id4: { x: 0, y: 210 },
    id5: { x: 0, y: 240 },
    id6: { x: 0, y: 270 },
    id7: { x: 0, y: 300 },
    id8: { x: 0, y: 330 },
    id9: { x: 0, y: 360 },
    id10: { x: 0, y: 390 },
  });
  const [alerted, setAlerted] = useState(false);
  function combineItems(item1: string, item2: string) {
    const combinedItem = ItemCombiner({firstItem: item1, secondItem: item2});
    console.log("Combined item: " + combinedItem);
    return combinedItem
  }

  return (
    <div>
      {alerted && (
        <AlertDismissable onClose={handleCloseAlert}>
          "Can't spawn more than 10 items!"
        </AlertDismissable>
      )}
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {ids.map(
          (id) =>
            isVisible[id as keyof typeof isVisible] && (
              <DragDropItem
                key={id}
                objPosition={positions[id as keyof typeof positions]}
                uniqueID={id}
              >{name[id as keyof typeof name]}</DragDropItem>
            )
        )}
      </DndContext>
      <Button onClick={handleClick}>Click to spawn an item!</Button>
    </div>
  );
  function handleClick() {
    const entries = Object.entries(isVisible);
    const idx = entries.findIndex(([key, value]) => value === false);
    if (idx === -1) {
      console.log("Cannot spawn more items!");
      setAlerted(true);
      return;
    }
    const spawningID = "id" + (idx + 1);
    setIsVisible((prev) => ({ ...prev, [spawningID]: true }));
    setPositions((prev) => ({
      ...prev,
      [spawningID]: {
        x: Math.floor(Math.random() * (window.innerWidth - 300 + 1)),
        y: Math.floor(Math.random() * (window.innerHeight - 300 + 1)),
      },
    }));
    console.log("Button clicked to spawn an item! " + spawningID);
  }
  function handleCloseAlert() {
    setAlerted(false);
    console.log("Alert dismissed!");
  }
  function ItemCombiner(props: { firstItem: string, secondItem: string }) {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleCombine = async () => {
      setLoading(true);
      try {
         //API call to FlowiseAI
        const res = await fetch(
          "https://cloud.flowiseai.com/api/v1/prediction/1c3d63c6-7894-4fed-96f8-89701f672d02",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: props.firstItem + " " + props.secondItem
            }),
          }
        );
        const data = await res.json();
        console.log("Flowise response:", data);
        // Set result to Flowise return, if no result, set to "No result"
        setResult(data?.text || "No result");
      } catch (err) {
        console.error(err);
        setResult("Error contacting Flowise");
      }
      setLoading(false);
    };
  
    return result;
  }
  function handleDragEnd(event: DragEndEvent) {
    const { delta } = event;
    const { id } = event.active;

    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: prev[id as keyof typeof prev].x + delta.x,
        y: prev[id as keyof typeof prev].y + delta.y,
      },
    }));
    console.log("Drag ended for item:", id);
    if (event.over && event.over.id !== id) {
      setIsVisible((prev) => ({ ...prev, [event.over!.id]: false }));
      const overPosition = positions[event.over!.id as keyof typeof positions];
      setPositions((prev) => ({
        ...prev,
        [id]: {
          x: overPosition.x ?? prev[id as keyof typeof prev].x,
          y: overPosition.y ?? prev[id as keyof typeof prev].y,
        },
      }));
      console.log(
        "Item dropped successfully! " + id + " over " + event.over!.id
      );
      const item1 = name[id as keyof typeof name];
      const item2 = name[event.over!.id as keyof typeof name];
      const combinedItem = combineItems(item1, item2);
      console.log("Combined item: " + combinedItem);
      setName((prev) => ({ ...prev, [id]: combinedItem }));
    }
  }
  function handleDragStart(event: DragStartEvent) {
    console.log("Drag started");
  }
}

export default App;
