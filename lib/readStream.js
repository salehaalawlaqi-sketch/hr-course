import { extractJson } from "./extractJson";

export async function readStreamedJson(res, onDelta) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onDelta(full);
  }

  if (full.includes("[[STREAM_ERROR]]")) {
    const message = full.split("[[STREAM_ERROR]]")[1]?.trim() || "The model failed to generate a response.";
    throw new Error(message);
  }

  return extractJson(full);
}
