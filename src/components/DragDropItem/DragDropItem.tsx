import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import styles from "./DragDropItem.module.css";

interface Props {
  uniqueID?: string;
  children?: React.ReactNode;
  objPosition: { x: number; y: number };
  className?: string;
}

const DragDropItem = ({
  uniqueID = "id2",
  children = "DragDrop Item",
  objPosition,
  className,
}: Props) => {
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: uniqueID,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    transform,
  } = useDraggable({
    id: uniqueID,
  });
  const combinedRef = React.useCallback(
    (node: HTMLElement | null) => {
      setDraggableNodeRef(node);
      setDroppableNodeRef(node);
    },
    [setDroppableNodeRef, setDraggableNodeRef]
  );
  const style: React.CSSProperties = {
    position: "absolute",
    left: objPosition.x + (transform?.x || 0),
    top: objPosition.y + (transform?.y || 0),
  };
  return (
    <button
      ref={combinedRef}
      style={style}
      className={className}
      {...listeners}
      {...attributes}
    >
      {children}
    </button>
  );
};

export default DragDropItem;
