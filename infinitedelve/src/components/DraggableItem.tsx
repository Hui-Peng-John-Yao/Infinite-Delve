import { useDraggable } from "@dnd-kit/core";

interface Props {
  uniqueID?: string;
  children?: React.ReactNode;
  objPosition?: { x: number; y: number };
}

const DraggableItem = ({
  uniqueID = "id1",
  children = "Drag me!",
  objPosition = { x: 0, y: 0 },
}: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: uniqueID,
  });
  const style: React.CSSProperties = {
    position: "absolute",
    left: objPosition.x + (transform?.x || 0),
    top: objPosition.y + (transform?.y || 0),
  };
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </button>
  );
};

export default DraggableItem;
