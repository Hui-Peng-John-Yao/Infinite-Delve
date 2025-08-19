import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import DragDropItem from "./components/DragDropItem/DragDropItem";
import Button from "./components/Button";
import AlertDismissable from "./components/AlertDismissable";
import ItemCombiner from "./ItemCombiner";
import ItemGenerator from "./ItemGenerator";
import LocationGenerator from "./LocationGenerator";
import DraggableItem from "./components/DraggableItem";
import "./App.css";
import Hotbar from "./components/Hotbar";
import styles from "./components/DragDropItem/DragDropItem.module.css";
import Combinations from "./Combinations";

function App() {
  const [location, setLocation] = useState("");
  const ids = [
    "id0",
    "id1",
    "id2",
    "id3",
    "id4",
    "id5",
    "id6",
    "id7",
    "id8",
    "id9",
  ];
  const [isVisible, setIsVisible] = useState({
    id0: false,
    id1: false,
    id2: false,
    id3: false,
    id4: false,
    id5: false,
    id6: false,
    id7: false,
    id8: false,
    id9: false,
  });
  const [parent, setParent] = useState({
    id0: null,
    id1: null,
    id2: null,
    id3: null,
    id4: null,
    id5: null,
    id6: null,
    id7: null,
    id8: null,
    id9: null,
  });
  const [name, setName] = useState({
    id0: "",
    id1: "",
    id2: "",
    id3: "",
    id4: "",
    id5: "",
    id6: "",
    id7: "",
    id8: "",
    id9: "",
  });
  const [positions, setPositions] = useState({
    id0: { x: 0, y: 120 },
    id1: { x: 0, y: 150 },
    id2: { x: 0, y: 180 },
    id3: { x: 0, y: 210 },
    id4: { x: 0, y: 240 },
    id5: { x: 0, y: 270 },
    id6: { x: 0, y: 300 },
    id7: { x: 0, y: 330 },
    id8: { x: 0, y: 360 },
    id9: { x: 0, y: 390 },
  });
  const [alerted, setAlerted] = useState(false);
  const draggableMarkup = (
    <DraggableItem uniqueID="draggable">Drag me</DraggableItem>
  );
  function getDroppableCoords(droppableElement: HTMLElement) {
    const rect = droppableElement.getBoundingClientRect();
    const rectX = rect.left;
    const rectY = rect.top;
    return { x: rectX, y: rectY };
  }
  function getIconFromName(id: keyof typeof name) {
    const parts = name[id].split(" ");
    return parts[0];
  }
  function addCombination(element1: string, element2: string, creation: string) {
    fetch("http://127.0.0.1:8080/api/combinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        element1: element1,
        element2: element2,
        creation: creation,
      }),
    })
      .then(res => res.json())
      .then(newRow => {
        console.log("Inserted:", newRow);
      })
      .catch(err => console.error("Error inserting:", err));
  }
  function CheckCombination(element1: string, element2: string) {
    var result = null;
    const checkCombination = () => {
      fetch(
        `http://127.0.0.1:8080/api/combinations/check?a=${encodeURIComponent(
          element1
        )}&b=${encodeURIComponent(element2)}`
      )
        .then(res => res.json())
        .then(data => result = data)
        .catch(err => console.error("Error checking combination:", err));
    }
    checkCombination();
    return result;
  };
  return (
    <div>
      {alerted && (
        <AlertDismissable onClose={handleCloseAlert}>
          "Can't spawn more than 10 items!"
        </AlertDismissable>
      )}
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        {/* <DroppableItem></DroppableItem> */}
        {ids.map(
          (id) =>
            isVisible[id as keyof typeof isVisible] && (
              <DragDropItem
                key={id}
                objPosition={positions[id as keyof typeof positions]}
                uniqueID={id}
                className={
                  parent[id as keyof typeof parent] ? styles.droppedItem : ""
                }
              >
                {parent[id as keyof typeof parent]
                  ? getIconFromName(id as keyof typeof name)
                  : name[id as keyof typeof name]}
              </DragDropItem>
            )
        )}
        <Hotbar ids={ids} heading="Hotbar"></Hotbar>
      </DndContext>
      <Button onClick={handleGenerateClick}>Click to spawn an item!</Button>
      <Button onClick={handleLocationClick}>
        Click to generate a location!
      </Button>
      <p>Location: {location}</p>
      <Combinations />
    </div>
  );
  async function handleGenerateClick() {
    const entries = Object.entries(isVisible);
    const idx = entries.findIndex(([key, value]) => value === false);
    if (idx === -1) {
      console.log("Cannot spawn more items!");
      setAlerted(true);
      return;
    }
    const spawningID = "id" + idx;
    let seen = "";
    for (let i = 0; i < idx; i++) {
      seen += name[`id${i}` as keyof typeof name] + " ";
    }
    const response = await ItemGenerator(location, seen);
    setName((prev) => ({ ...prev, [`id${idx}`]: response }));
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
  async function handleLocationClick() {
    const genLocation = await LocationGenerator(1);
    console.log("GenLocation: " + genLocation);
    setLocation(genLocation);
    console.log("Location: " + location);
  }
  function handleCloseAlert() {
    setAlerted(false);
    console.log("Alert dismissed!");
  }

  async function handleDragEnd(event: DragEndEvent) {
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
      if (
        typeof event.over.id === "string" &&
        event.over.id.includes("-hotbar")
      ) {
        // Handle dropping over hotbar
        setParent((prev) => ({ ...prev, [id]: event.over!.id }));
        // Set the position of the dragged item to the position of the droppable item
        const droppableId = event.over.id;
        console.log("Droppable ID:", droppableId);
        const droppableElement = document.getElementById(droppableId);
        console.log("Droppable Element:", droppableElement);
        const center = getDroppableCoords(droppableElement!);
        const overX = center.x;
        const overY = center.y;
        console.log(overX, overY);
        setPositions((prev) => ({
          ...prev,
          [id]: {
            x: overX ?? prev[id as keyof typeof prev].x,
            y: overY ?? prev[id as keyof typeof prev].y,
          },
        }));

        console.log(
          "Item dropped over hotbar! " + id + " over " + event.over.id
        );
      } else {
        setIsVisible((prev) => ({ ...prev, [event.over!.id]: false }));
        const overPosition =
          positions[event.over!.id as keyof typeof positions];
        setPositions((prev) => ({
          ...prev,
          [id]: {
            x: overPosition.x ?? prev[id as keyof typeof prev].x,
            y: overPosition.y ?? prev[id as keyof typeof prev].y,
          },
        }));
        console.log(
          "Item dropped successfully on another item! " +
            id +
            " over " +
            event.over!.id
        );
        const item1 = name[id as keyof typeof name];
        const item2 = name[event.over!.id as keyof typeof name];
        var combinedItem = ""
        //Check if combination already exists
        const combo = CheckCombination(item1, item2) as { exists: boolean, creation: string } | null;
        console.log("Combo: " + combo);
        if (combo && combo.exists) {
          combinedItem = combo.creation;
        }
        else{
          //Use Flowise to combine items
          combinedItem = await ItemCombiner(item1, item2);
          addCombination(item1, item2, combinedItem);
        }      
      setName((prev) => ({ ...prev, [id]: combinedItem }));
      }
    } else if (!event.over) {
      setParent((prev) => ({ ...prev, [id]: null }));
    }
  }
  function handleDragStart(event: DragStartEvent) {
    console.log("Drag started");
  }
}

export default App;
