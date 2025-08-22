export async function findCombo(item1: string, item2: string) {
    try {
      const response = await fetch(
        `https://0tfeyivdeb.execute-api.us-east-1.amazonaws.com/Test/combos/findCombo?item1=${encodeURIComponent(item1)}&item2=${encodeURIComponent(item2)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Failed to fetch combo:", err);
      return null;
    }
  }