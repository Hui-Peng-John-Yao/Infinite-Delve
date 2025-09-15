export default async function handleGenerate(list: string[]){
  var loading = true;
  var result = "";
    try {
       //API call to FlowiseAI
      const res = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/75821279-c2ff-4e53-8bac-ab3930cf582c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "item " + list.join(", ")
          }),
        }
      );
      const data = await res.json();
      //console.log("Flowise response:", data);
      const text = data.text
      console.log("ElementalItemGenerator: " + text);
      return text
    } catch (err) {
      console.error(err);
    }
    loading = false;
}