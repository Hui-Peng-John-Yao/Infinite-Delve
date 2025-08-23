export default async function handleCombine(
  firstItem: string,
  secondItem: string
) {
  var loading = true;
  var result = "";
  try {
    //API call to FlowiseAI
    const res = await fetch(
      "https://cloud.flowiseai.com/api/v1/prediction/1c3d63c6-7894-4fed-96f8-89701f672d02",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: firstItem + " " + secondItem,
        }),
      }
    );
    const data = await res.json();
    console.log("Flowise response:", data);
    const text = data.text;
    console.log("Flowise response text:", text);
    // Set result to Flowise return, if no result, set to "No result"
    return text;
  } catch (err) {
    console.error(err);
  }
  loading = false;
}
async function ItemCombiner(props: { firstItem: string; secondItem: string }) {
  console.log(
    "Combining items: " + props.firstItem + " and " + props.secondItem
  );
  var result = await handleCombine(props.firstItem, props.secondItem);
  console.log("Combined item: " + result);
  return result;
}
