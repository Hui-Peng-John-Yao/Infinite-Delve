import { useDroppable } from "@dnd-kit/core";
import React, { useEffect, useRef } from "react";
import styles from "./DroppableItem.module.css";

interface Props {
  uniqueID?: string;
  children?: React.ReactNode;
  CSSstyle?: string;
}

const DroppableItem = ({
  uniqueID = "droppable-item",
  CSSstyle = styles.droppableItem,
  children = "Drop over me!",
  
}: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: uniqueID,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  const droppableRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (droppableRef.current) {
      const rect = droppableRef.current.getBoundingClientRect();
      console.log("Droppable position:", rect.left, rect.top);
    }
  }, [setNodeRef]);
  return (
    <div
      ref={setNodeRef}
      id={uniqueID}
      style={style}
      className={CSSstyle}
    >
      {children}
    </div>
  );
};

export default DroppableItem;
