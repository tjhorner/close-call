import { generateDigestData } from "$lib/digest/generate"
import type { PageServerLoad } from "./$types"
import { DIGEST_KEY } from "$env/static/private"
import { error } from "@sveltejs/kit"

export const load = (async ({ params, url }) => {
  if (url.searchParams.get("key") !== DIGEST_KEY) {
    error(403, "Invalid key")
  }

  const data = await generateDigestData(params.jurisdiction)
  return data
}) satisfies PageServerLoad