export default async function handleJudgement(
    challenge: string,
    items: string[]
  ) {
    var loading = true;
    var result = "";
    try {
      //API call to FlowiseAI
      const res = await fetch(
        "https://cloud.flowiseai.com/api/v1/prediction/48cb1d6c-2ef5-48f7-9a95-05a9fb06666c",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: "Challenge: " + challenge + " Items: " + items.join(", "),
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
  async function ChallengeJudger(props: { challenge: string; items: string[] }) {
    console.log(
      "Judging challenge: " + props.challenge + " with items: " + props.items
    );
    var result = await handleJudgement(props.challenge, props.items);
    console.log("Judgement result: " + result);
    return result;
  }
  