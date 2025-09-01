import { useEffect, useRef, useState } from "react";
import DroppableItem from "../DroppableItem/DroppableItem";
import styles from "./Hotbar.module.css";
import React from "react";

interface Props {
  ids: string[];
  heading?: string;
  //onDropItem: (item: string) => void;
}
const Hotbar = ({ ids, heading = "" /*onDropItem*/ }: Props) => {
  //ids = [];

  //const [selectedIndex, setSelectedIndex] = useState(-1);
  const hotbarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hotbarRef.current) {
      const rect = hotbarRef.current.getBoundingClientRect();
      console.log("Hotbar position:", rect.left, rect.top);
    }
  }, []);
  return (
    <>
      <h1>{heading}</h1>
      <div ref={hotbarRef} className={styles.hotbarBottomAligned}>
        {ids.length === 0 && <p>No Hotbar Found</p>}
        <ul style={{ padding: "0px", marginBottom: "0px" }}>
          {ids.map((id, index) => (
            <DroppableItem key={id + "-hotbar"} uniqueID={id + "-hotbar"} CSSstyle={styles.hotbarDroppableItem}>
              {id}
            </DroppableItem>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Hotbar;
