import OpenAI from "openai"
import { env } from "$env/dynamic/private"
import BadWordsFilter from "bad-words"

const openai = new OpenAI()
const badWordsFilter = new BadWordsFilter()

export async function isTextInappropriate(text: string): Promise<boolean> {
  if (badWordsFilter.isProfane(text)) {
    return true
  }

  if (env.OPENAI_API_KEY) {
    const moderationResult = await openai.moderations.create({
      input: text
    })
  
    if (moderationResult.results[0].flagged) {
      return true
    }
  }

  return false
}