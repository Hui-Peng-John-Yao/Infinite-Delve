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
import Hotbar from "./components/Hotbar/Hotbar";
import dragDropStyles from "./components/DragDropItem/DragDropItem.module.css";
import HoverDesc from "./components/HoverDesc/HoverDesc";
import GoalsWindow from "./components/GoalsWindow/GoalsWindow";
import { addCombo } from "./PostCombo";
import { findCombo } from "./GetCombo";
import ChallengeGenerator from "./ChallengeGenerator";
import ChallengeJudge from "./ChallengeJudge";
import BasicItemGenerator from "./BasicItemGenerator";
import ElementalItemGenerator from "./ElementalItemGenerator";

document.body.style.overflow = "hidden";


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
  const [goals, setGoals] = useState<string[]>([
    "Find the key",
    "Unlock the door",
    "Escape the dungeon",
  ]);
  const [completedGoals, setCompletedGoals] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [boughtSpawners, setBoughtSpawners] = useState({
    basic: true,
    location: true,
    elemental: false,
  })
  const [result, setResult] = useState<string[]>([]);
  const [HoverName, setHoverName] = useState("hover-desc");
  const [HoverVisible, setHoverVisible] = useState(false);
  const [alerted, setAlerted] = useState(false);
  const [levelNumber, setLevelNumber] = useState(1);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [currentPage, setCurrentPage] = useState("main");

  // Simple page components
function Page1({ onReturn }: { onReturn: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Shop</h1>
      <p>This is the shop page where you can buy item spawners.</p>
      {Object.entries(boughtSpawners).filter(([key, value]) => value === false).map(([key]) => (
          <Button key={key} onClick={() => setBoughtSpawners((prev) => ({ ...prev, [key]: true }))}>
            Click to buy the {key} spawner!
          </Button>
        ))}
      <Button onClick={onReturn}>Return to Main Page</Button>
    </div>
  );
}

function Page2({ onReturn }: { onReturn: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Page 2</h1>
      <p>This is Page 2 - a template page</p>
      <Button onClick={onReturn}>Return to Main Page</Button>
    </div>
  );
}

function Page3({ onReturn }: { onReturn: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Page 3</h1>
      <p>This is Page 3 - a template page</p>
      <Button onClick={onReturn}>Return to Main Page</Button>
    </div>
  );
}
  // Initialize location
  useEffect(() => {
    const initializeLocationGoals = async () => {
      var genLocation = await LocationGenerator(levelNumber);
      setLocation(genLocation);
      var genGoals = await ChallengeGenerator(genLocation);
      genGoals = genGoals.split("/");
      console.log("GenGoals: " + genGoals);
      setGoals(genGoals);
    };
    initializeLocationGoals();
  }, []);
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
  function canFitMore() {
    let count = 0;
    for (let i = 0; i < 10; i++) {
      if (
        parent[`id${i}` as keyof typeof parent] === "goals-window-droppable"
      ) {
        count++;
      }
    }
    return count < 3;
  }
  async function newLevel() {
    setResult([]);
    setCompletedGoals([false, false, false]);
    setShowContinueButton(false);
    const genLocation = await LocationGenerator(levelNumber + 1);
    setLevelNumber((prev) => prev + 1);
    setLocation(genLocation);
    var genGoals = await ChallengeGenerator(genLocation);
    genGoals = genGoals.split("/");
    console.log("New level GenGoals: " + genGoals);
    setGoals(genGoals);
  }
  async function handleContinueClick() {
    console.log("Continue button clicked! Advancing to next level.");
    newLevel();
  }
  // Handle page navigation
  if (currentPage === "page1") {
    return <Page1 onReturn={() => setCurrentPage("main")} />;
  }
  if (currentPage === "page2") {
    return <Page2 onReturn={() => setCurrentPage("main")} />;
  }
  if (currentPage === "page3") {
    return <Page3 onReturn={() => setCurrentPage("main")} />;
  }

  return (
    <>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div
          style={{
            position: "relative",
            width: "75%",
            height: "100%",
            overflow: "hidden",
          }}
          id="SandboxWindow"
        >
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
              {"Level " + levelNumber + ": " + location}
            </h1>
          </div>
          <Hotbar ids={ids}></Hotbar>
        </div>
        {ids.map(
          (id) =>
            isVisible[id as keyof typeof isVisible] && (
              <DragDropItem
                key={id}
                objPosition={positions[id as keyof typeof positions]}
                uniqueID={id}
                className={
                  parent[id as keyof typeof parent]
                    ? dragDropStyles.droppedItem
                    : dragDropStyles.undroppedItem
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
        <GoalsWindow
          goals={goals}
          result={result}
          submitAction={handleSubmitClick}
          completedGoals={completedGoals}
        ></GoalsWindow>
      </DndContext>
      <HoverDesc text={HoverName} visible={HoverVisible}></HoverDesc>
      <ul style={{ padding: "0px", marginBottom: "0px" }}>
        {Object.entries(boughtSpawners).filter(([key, value]) => value === true).map(([key]) => (
          <Button key={key} onClick={() => handleGenerateClick(key)}>
            Click to spawn a {key} item!
          </Button>
        ))}
      </ul>
      <Button onClick={handleLocationClick}>
        Click to re-roll the location!
      </Button>
      {showContinueButton && (
        <Button onClick={handleContinueClick}>
          Continue
        </Button>
      )}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <div style={{ margin: "5px", display: "inline-block" }}>
          <Button onClick={() => setCurrentPage("page1")}>
            Go to Page 1
          </Button>
        </div>
        <div style={{ margin: "5px", display: "inline-block" }}>
          <Button onClick={() => setCurrentPage("page2")}>
            Go to Page 2
          </Button>
        </div>
        <div style={{ margin: "5px", display: "inline-block" }}>
          <Button onClick={() => setCurrentPage("page3")}>
            Go to Page 3
          </Button>
        </div>
      </div>
    </>
  );
  async function handleGenerateClick(type: string) {
    let idx = null;
    let seenIDS: string[] = [];
    for (let i = 0; i < 10; i++) {
      if (isVisible[`id${i}` as keyof typeof isVisible] === true) {
        seenIDS.push(name[`id${i}` as keyof typeof name]);
      } else if (idx === null) {
        idx = i;
      }
    }
    if (seenIDS.length === 10) {
      console.log("Cannot spawn more items!");
      setAlerted(true);
      return;
    }
    const spawningID = "id" + idx;
    let seen = "";
    for (const name of seenIDS) {
      seen += name + " ";
    }
    let response = "";
    switch (type) {
      case "basic":
        response = await BasicItemGenerator(seen);
        console.log("Button clicked to spawn a basic item! " + spawningID);
        break;
      case "location":
        response = await ItemGenerator(location, seen);
        console.log("Button clicked to spawn a location item! " + spawningID);
        break;
      case "elemental":
        response = await ElementalItemGenerator(seen);
        console.log("Button clicked to spawn an elemental item! " + spawningID);
        break;
      default:
        response = await BasicItemGenerator(seen);
        console.log("Switch case default! Reverting to default. " + spawningID);
        break;
    }
    setName((prev) => ({ ...prev, [spawningID]: response }));
    setIsVisible((prev) => ({ ...prev, [spawningID]: true }));
    setPositions((prev) => ({
      ...prev,
      [spawningID]: {
        x: Math.floor(Math.random() * (window.innerWidth - 300 + 1)),
        y: Math.floor(Math.random() * (window.innerHeight - 300 + 1)),
      },
    }));
    
  }
  async function handleLocationClick() {
    newLevel();
  }
  async function handleSubmitClick() {
    console.log("Submit button clicked!");
    let itemsInGoals: string[] = [];
    for (let i = 0; i < 10; i++) {
      if (
        parent[`id${i}` as keyof typeof parent] === "goals-window-droppable"
      ) {
        console.log(
          "Item in goals window: " + name[`id${i}` as keyof typeof name]
        );
        itemsInGoals.push(name[`id${i}` as keyof typeof name]);
      }
    }
    // Handle submission logic here, use itemsInGoals array for which items, and goals useState for goals. Return some sort of success/failure.
    var result = [];
    result[0] = await ChallengeJudge(goals[0], itemsInGoals);
    result[1] = await ChallengeJudge(goals[1], itemsInGoals);
    result[2] = await ChallengeJudge(goals[2], itemsInGoals);
    console.log("Result: " + result);
    const resultsBool = result.map((res) => res.includes("[Success]"));
    console.log("Results bool: " + resultsBool);
    let finalCompletedResults: boolean[] = [];
    for (let i = 0; i < 3; i++) {
      finalCompletedResults[i] = completedGoals[i] || resultsBool[i];
    }
    setCompletedGoals(finalCompletedResults);
    const resultNum = finalCompletedResults.filter(
      (item) => item === true
    ).length;
    console.log(finalCompletedResults);
    setResult(result);
    if (resultNum >= 2) {
      // All goals completed successfully
      console.log("All goals completed successfully! Show continue button.");
      setShowContinueButton(true);
    }
  }
  function handleCloseAlert() {
    setAlerted(false);
    console.log("Alert dismissed!");
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { delta } = event;
    const { id } = event.active;
    const prevPosition = positions[id as keyof typeof positions];
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
      } else if (event.over.id === "goals-window-droppable") {
        console.log("Item dropped over goals window: " + id);
        if (canFitMore()) {
          console.log("Fitting item into goals window: " + id);
          setParent((prev) => ({ ...prev, [id]: "goals-window-droppable" }));
        } else {
          console.log("Cannot fit more items in goals window!");
          setPositions((prev) => ({
            ...prev,
            [id]: prevPosition,
          }));
        }
      } else if (parent[event.over.id as keyof typeof parent]!=="goals-window-droppable") {
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
        var combinedItem = "";
        const combo = await findCombo(item1, item2);
        if (!combo.message) {
          combinedItem = combo.combination;
        } else {
          combinedItem = await ItemCombiner(item1, item2);
          console.log("Combined item: " + combinedItem);
          addCombo(item1, item2, combinedItem);
        }
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
      } else {
        // Dropped on an item in the goals window, reset to previous position.
        console.log(
          "Item dropped on an item in the goals window, resetting to previous position: " + id
        );
        setPositions((prev) => ({
          ...prev,
          [id]: prevPosition,
        }));
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
