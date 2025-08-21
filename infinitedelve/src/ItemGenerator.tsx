export default async function handleGenerate(location: string, seen: string){
    var loading = true;
    var result = "";
      try {
         //API call to FlowiseAI
        const res = await fetch(
          "https://cloud.flowiseai.com/api/v1/prediction/a7ff8439-a116-4bb1-af40-6080310b842a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: location + " " + seen
            }),
          }
        );
        const data = await res.json();
        //console.log("Flowise response:", data);
        const text = data.text
        //console.log("Flowise response text:", text);
        return text
      } catch (err) {
        console.error(err);
      }
      loading = false;
  }
  async function ItemGenerator(location: string, seen: string) {
    var result = await handleGenerate(location, seen);
    return result
  }