import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface Props {
  uniqueID?: string;
  children?: React.ReactNode;
}

const DroppableItem = ({
  uniqueID = "droppable-item",
  children = "Drop over me!",
}: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: uniqueID,
  });
  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default DroppableItem;
