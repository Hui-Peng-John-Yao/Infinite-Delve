import { useEffect, useState } from "react";

export default function Combinations() {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/combinations")
      .then(res => res.json())
      .then(data => setCombos(data));
  }, []);

  const combo = combos[0] as { component1: string; component2: string; creation: string };

  return (
    <div>
      <h1>Combinations</h1>
      <p>{combo?.component1}</p>
      <p>{combo?.component2}</p>
      <p>{combo?.creation}</p>
    </div>
  );
}
