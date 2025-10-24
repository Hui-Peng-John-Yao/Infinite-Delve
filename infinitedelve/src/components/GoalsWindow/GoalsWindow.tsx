import React from "react";
import DroppableItem from "../DroppableItem/DroppableItem";
import styles from "./GoalsWindow.module.css";
import Button from "../Button";
interface Props {
  goals: string[];
  result?: string[];
  completedGoals: boolean[];
  submitAction: () => void;
}
const GoalsWindow = ({
  goals,
  result = [],
  completedGoals = [],
  submitAction,
}: Props) => {
  return (
    <div className={styles.goalsWindow}>
      <h2>To Escape</h2>
      <ul>
        {goals.map((goal, index) => (
          <li
            key={index}
            className={completedGoals[index] ? styles.goalComplete : ""}
          >
            {goal}
          </li>
        ))}
      </ul>
      <DroppableItem
        uniqueID="goals-window-droppable"
        CSSstyle={styles.goalsWindowDroppable}
      ></DroppableItem>
      <Button onClick={submitAction} color="primary">
        Submit
      </Button>
      {result.length > 0 && (
        <>
          <h3>Results:</h3>
          {result.map((response, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <strong>{goals[index]}:</strong>
              <p style={{ margin: "5px 0", fontSize: "0.9em" }}>{response}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GoalsWindow;
