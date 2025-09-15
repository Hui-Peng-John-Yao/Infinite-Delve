export default async function handleGenerate(seen: string){
  var loading = true;
  var result = "";
    try {
      //API call to FlowiseAI
      const res = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/c4254f0f-d8b5-4322-9cd2-7145a6588b77",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "item " + seen
          }),
        }
      );
      const data = await res.json();
      //console.log("Flowise response:", data);
      const text = data.text
      console.log("BasicItemGenerator: " + text);
      return text
    } catch (err) {
      console.error(err);
    }
    loading = false;
}