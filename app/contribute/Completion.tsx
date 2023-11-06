"use client";

import { useCompletion } from "ai/react";
import { useRef } from "react";

export default function Completion(props: { createNewExtension: (f: FormData) => Promise<void> }) {
  const { completion, complete } = useCompletion({
    api: "/api/completion",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerateAIResponse = () => {
    if (!inputRef.current?.value) return;
    complete(inputRef.current.value);
  };

  return (
    <div>
      <form action={props.createNewExtension} className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <label>Enter a prompt</label>
          <input
            type="text"
            name="prompt"
            id="prompt"
            className="block rounded-md px-2 py-1 text-black"
            required
            ref={inputRef}
          />
          <button
            type="button"
            className="max-w-xl rounded-md border-2 border-slate-600 px-4 py-2"
            onClick={handleGenerateAIResponse}
          >
            Generate sample response
          </button>
        </div>
        <div className="h-80 w-80 overflow-y-auto border-2 border-rose-600 p-4">{completion}</div>

        <button type="submit" className="rounded-md bg-rose-500 px-4 py-2">
          Submit
        </button>
      </form>
    </div>
  );
}
