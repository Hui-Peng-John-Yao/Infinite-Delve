export default async function handleGenerate(location: string){
    console.log("Challenge Location: " + location);
    var loading = true;
    var result = "";
      try {
         //API call to FlowiseAI
        const res = await fetch(
          "https://cloud.flowiseai.com/api/v1/prediction/6617c9c8-da7c-402a-8c0b-23eb261cbe0b",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: location
            }),
          }
        );
        const data = await res.json();
        console.log("Flowise response:", data);
        const text = data.text
        //console.log("Flowise response text:", text);
        return text
      } catch (err) {
        console.error(err);
      }
      loading = false;
  }
  async function ChallengeGenerator(location: string) {
    var result = await handleGenerate(location);
    return result
  }