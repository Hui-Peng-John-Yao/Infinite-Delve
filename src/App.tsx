import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import DragDropItem from "./components/DragDropItem";
import Button from "./components/Button";
import AlertDismissable from "./components/AlertDismissable";
import ItemCombiner from "./ItemCombiner";
import ItemGenerator from "./ItemGenerator";
import LocationGenerator from "./LocationGenerator";
import Combinations from "./Combinations";

function App() {
  // Already Created Combinations
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/combinations")
      .then(res => res.json())
      .then(data => setCombos(data));
  }, []);
  const [location, setLocation] = useState("");
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
    id1: false,
    id2: false,
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
    id1: "",
    id2: "",
    id3: "",
    id4: "",
    id5: "",
    id6: "",
    id7: "",
    id8: "",
    id9: "",
    id10: "",
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
      <Button onClick={handleGenerateClick}>Click to spawn an item!</Button>
      <Button onClick={handleLocationClick}>Click to generate a location!</Button>
      <p>Location: {location}</p>
      <Combinations />
    </div>
  );
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
  async function handleGenerateClick() {
    const entries = Object.entries(isVisible);
    const idx = entries.findIndex(([key, value]) => value === false);
    if (idx === -1) {
      console.log("Cannot spawn more items!");
      setAlerted(true);
      return;
    }
    const spawningID = "id" + (idx + 1);
    let seen = "";
    for (let i = 0; i < idx; i++) { 
      seen += name[`id${i+1}` as keyof typeof name] + " ";
    }
    const response = await ItemGenerator(location, seen);
    setName(prev => ({ ...prev, [`id${idx+1}`]: response }));
    setIsVisible((prev) => ({ ...prev, [spawningID]: true }));
    setPositions((prev) => ({
      ...prev,
      [spawningID]: {
        x: Math.floor(Math.random() * (window.innerWidth - 300 + 1)),
        y: Math.floor(Math.random() * (window.innerHeight - 300 + 1)),
      },
    }));
    console.log("Button clicked to spawn an item! " + spawningID);
  };
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
  }
  function handleDragStart(event: DragStartEvent) {
    console.log("Drag started");
  }
}

export default App;
