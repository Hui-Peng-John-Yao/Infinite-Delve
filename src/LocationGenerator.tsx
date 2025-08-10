export default async function handleGenerate(creativityValue: number){
    var loading = true;
    var result = "";
      try {
         //API call to FlowiseAI
        const res = await fetch(
          "https://cloud.flowiseai.com/api/v1/prediction/04561305-622d-4f85-8748-3955d49d22f4",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: creativityValue
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
  async function LocationGenerator(creativityValue: number) {
    var result = await handleGenerate(creativityValue);
    return result
  }