export async function chatWithGPT(message) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`,
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "system", "content": message}]
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  
  const messageContent = json.choices[0].message.content;

  return messageContent;
}






