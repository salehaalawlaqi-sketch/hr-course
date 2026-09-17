import OpenAI from "openai";

export const MODEL = "meta/llama-3.2-11b-vision-instruct";

export function isLiveModeEnabled() {
  return Boolean(process.env.NVIDIA_API_KEY);
}

export function getClient() {
  return new OpenAI({
    baseURL: "https://integrate.api.nvidia.com/v1",
    apiKey: process.env.NVIDIA_API_KEY,
  });
}
