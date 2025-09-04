import React from "react";
import DroppableItem from "../DroppableItem/DroppableItem";
import styles from "./GoalsWindow.module.css";
import Button from "../Button";
interface Props {
  goals: string[];
  result?: number;
  submitAction: () => void;
}
const GoalsWindow = ({ goals, result = 0, submitAction }: Props) => {
  return (
    <div className={styles.goalsWindow}>
      <h2>To Escape</h2>
      <ul>
        {goals.map((goal, index) => (
          <li key={index}>{goal}</li>
        ))}
      </ul>
      <DroppableItem
        uniqueID="goals-window-droppable"
        CSSstyle={styles.goalsWindowDroppable}
      ></DroppableItem>
      <Button onClick={submitAction} color="primary">
        Submit
      </Button>
      {result && (
        <div>
          <h3>Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default GoalsWindow;
