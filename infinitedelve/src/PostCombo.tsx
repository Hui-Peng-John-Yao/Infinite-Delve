const apiUrl = "https://0tfeyivdeb.execute-api.us-east-1.amazonaws.com/Test/combos";

export async function addCombo(item1: string, item2: string, combination: string) {
  if (!item1 || !item2 || !combination) {
    throw new Error("All fields are required: item1, item2, combination");
  }

  try {
    const comboId = Date.now();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comboId, item1, item2, combination})
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server responded with status ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (err) {
    console.error("Error adding combo:", err);
    throw err;
  }
}