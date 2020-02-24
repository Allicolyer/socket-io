export const apiCall = context => {
  fetch("https://transformer.huggingface.co/autocomplete/gpt2/large", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      context: context,
      model_size: "gpt2/large",
      top_p: 0.9,
      temperature: 1,
      max_time: 1
    })
  })
    .then(response => {
      return response.json();
    })
    .then(myJson => {
      console.log(myJson.sentences[0].value);
      return myJson.sentences[0].value;
    });
};
