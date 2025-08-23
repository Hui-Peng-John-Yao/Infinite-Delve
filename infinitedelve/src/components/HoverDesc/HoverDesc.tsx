import React, { useEffect, useState } from "react";
import styles from "./HoverDesc.module.css";

interface Props {
  text: string;
  visible: boolean;
}

const HoverDesc = ({ text = "HoverDesc", visible }: Props) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  const style: React.CSSProperties = {
    position: "absolute",
    left: mousePosition.x,
    top: mousePosition.y,
    opacity: visible ? 1 : 0,
    pointerEvents: "none",
  };
  return (
    <div className={styles["hover-desc"]} style={style}>
      {text}
    </div>
  );
};

export default HoverDesc;
