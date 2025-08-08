import React, { useState } from "react";

export default function ItemCombinerUI() {
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCombine = async () => {
    setLoading(true);
    try {
       //API call to FlowiseAI
      const res = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/1c3d63c6-7894-4fed-96f8-89701f672d02",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: item1 + " " + item2
          }),
        }
      );
      const data = await res.json();
      console.log("Flowise response:", data);
      // Set result to Flowise return, if no result, set to "No result"
      setResult(data?.text || "No result");
    } catch (err) {
      console.error(err);
      setResult("Error contacting Flowise");
    }
    setLoading(false);
  };

  return (
    <div>
      {result}
    </div>
  );
}