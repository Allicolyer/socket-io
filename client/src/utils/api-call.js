export const apiCall = context => {
  return fetch("https://transformer.huggingface.co/autocomplete/gpt2/large", {
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
      // picks the longest response out of the three response messages
      let longest = "";
      myJson.sentences.forEach(sentence => {
        if (sentence.value.length > longest.length) {
          longest = sentence.value;
        }
      });
      
      return longest;
    });
};
