import OpenAI from "openai"
import usaBounds from "./usa.json"
import { booleanPointInPolygon } from "@turf/turf"
import { env } from "$env/dynamic/private"

export function isWithinAllowedBounds(lat: number, lng: number): boolean {
  return booleanPointInPolygon([lng, lat], usaBounds as any)
}

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