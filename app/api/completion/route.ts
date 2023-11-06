import { OpenAIStream, StreamingTextResponse } from "ai";

import { openaiInstance } from "@/lib/openai";


export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();

  // Request the OpenAI API for the response based on the prompt
  const response = await openaiInstance.completions.create({
    model: "gpt-3.5-turbo-instruct",
    stream: true,
    prompt: prompt,
    max_tokens: 200,
    temperature: 0.5,
    top_p: 1,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
