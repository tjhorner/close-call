import OpenAI from "openai"
import { env } from "$env/dynamic/private"

export async function isTextInappropriate(text: string): Promise<boolean> {
  if (env.OPENAI_API_KEY) {
    const openai = new OpenAI()

    const moderationResult = await openai.moderations.create({
      input: text
    })
  
    if (moderationResult.results[0].flagged) {
      return true
    }
  }

  return false
}