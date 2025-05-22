import { generateDigestShapefile } from "$lib/digest/generate"
import { DIGEST_KEY } from "$env/static/private"
import { error, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = (async ({ params, url }) => {
  if (url.searchParams.get("key") !== DIGEST_KEY) {
    error(403, "Invalid key")
  }

  const data = await generateDigestShapefile(params.jurisdiction!)
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/geo+json",
      "Content-Disposition": `attachment; filename=close-call-reports.geojson`
    }
  })
})