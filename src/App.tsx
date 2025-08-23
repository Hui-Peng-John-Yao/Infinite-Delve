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
import HoverDesc from "./components/HoverDesc/HoverDesc";
//import Combinations from "./Combinations";

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
  const [HoverName, setHoverName] = useState("hover-desc");
  const [HoverVisible, setHoverVisible] = useState(false);
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
  function hasChild(hotbarID: string) {
    for (let i = 0; i < 10; i++) {
      if (parent[`id${i}` as keyof typeof parent] === hotbarID) {
        return `id${i}`;
      }
    }
    return false;
  }
  return (
    <div>
      {alerted && (
        <AlertDismissable onClose={handleCloseAlert}>
          "Can't spawn more than 10 items!"
        </AlertDismissable>
      )}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <h1
          style={{
            color: "blue",
            padding: "10px",
            border: "4px solid black",
            borderRadius: "10px",
            textAlign: "center",
            display: "inline-block",
          }}
        >
          {"Level 1: " + location}
        </h1>
      </div>
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
                onMouseEnter={() => {
                  if (parent[id as keyof typeof parent] !== null) {
                    setHoverName(name[id as keyof typeof name]);
                    setHoverVisible(true);
                  }
                }}
                onMouseLeave={() => setHoverVisible(false)}
              >
                {parent[id as keyof typeof parent]
                  ? getIconFromName(id as keyof typeof name)
                  : name[id as keyof typeof name]}
              </DragDropItem>
            )
        )}
        <Hotbar ids={ids}></Hotbar>
      </DndContext>
      <HoverDesc text={HoverName} visible={HoverVisible}></HoverDesc>
      <Button onClick={handleGenerateClick}>Click to spawn an item!</Button>
      <Button onClick={handleLocationClick}>
        Click to generate a location!
      </Button>
      <p>Location: {location}</p>
      {/* <Combinations /> */}
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
    console.log("Drag event for id: " + id + " over " + event.over?.id);
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
        console.log(
          "Dropping item over hotbar: " + id + " over " + event.over.id
        );
        const droppableId = event.over.id;
        const droppableElement = document.getElementById(droppableId);
        const childID = hasChild(event.over!.id);
        // Handle dropping over hotbar
        setParent((prev) => ({ ...prev, [id]: event.over!.id }));
        // Set the position of the dragged item to the position of the droppable item
        if (childID && childID !== id) {
          console.log(
            "Child ID found when dragging item over hotbar :",
            childID
          );
          setIsVisible((prev) => ({ ...prev, [childID]: false }));
          setParent((prev) => ({ ...prev, [childID]: null }));
          console.log(
            "Item dropped successfully on child item! " +
              id +
              " over " +
              childID
          );
          const item1 = name[id as keyof typeof name];
          const item2 = name[childID as keyof typeof name];
          const combinedItem = await ItemCombiner(item1, item2);
          setName((prev) => ({ ...prev, [id]: combinedItem }));
          setParent((prev) => ({ ...prev, [id]: event.over!.id }));
          const droppableElement = document.getElementById(event.over!.id);
          const coords = getDroppableCoords(droppableElement!);
          const overX = coords.x;
          const overY = coords.y;
          setPositions((prev) => ({
            ...prev,
            [id]: {
              x: overX ?? prev[id as keyof typeof prev].x,
              y: overY ?? prev[id as keyof typeof prev].y,
            },
          }));
          console.log(
            "Resulting item dropped over hotbar! " +
              id +
              " over " +
              event.over!.id
          );
        }
        const coords = getDroppableCoords(droppableElement!);
        const overX = coords.x;
        const overY = coords.y;
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
        let parented = false;
        const parentID = parent[event.over!.id as keyof typeof parent];
        if (parentID !== null) {
          parented = true;
        } else {
          setParent((prev) => ({ ...prev, [id]: null }));
        }
        setParent((prev) => ({ ...prev, [event.over!.id]: null }));
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
        const combinedItem = await ItemCombiner(item1, item2);
        setName((prev) => ({ ...prev, [id]: combinedItem }));
        if (parented) {
          setParent((prev) => ({ ...prev, [id]: parentID }));
          const droppableElement = document.getElementById(parentID!);
          const coords = getDroppableCoords(droppableElement!);
          const overX = coords.x;
          const overY = coords.y;
          setPositions((prev) => ({
            ...prev,
            [id]: {
              x: overX ?? prev[id as keyof typeof prev].x,
              y: overY ?? prev[id as keyof typeof prev].y,
            },
          }));
          console.log(
            "Resulting item dropped over hotbar! " + id + " over " + parentID
          );
        }
      }
    } else if (
      event.over &&
      event.over.id === id &&
      parent[id as keyof typeof parent]
    ) {
      // If dropped on itself and has a parent, reset to parent position
      const parentID = parent[id as keyof typeof parent];
      const droppableElement = document.getElementById(parentID!);
      const coords = getDroppableCoords(droppableElement!);
      const overX = coords.x;
      const overY = coords.y;
      setPositions((prev) => ({
        ...prev,
        [id]: {
          x: overX ?? prev[id as keyof typeof prev].x,
          y: overY ?? prev[id as keyof typeof prev].y,
        },
      }));
      console.log(
        "Item dropped on itself with a parent, resetting to parent position: " +
          id
      );
    } else if (!event.over) {
      setParent((prev) => ({ ...prev, [id]: null }));
    }
  }
  function handleDragStart(event: DragStartEvent) {
    console.log("Drag started");
  }
}

export default App;
