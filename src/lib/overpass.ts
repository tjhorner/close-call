export interface OverpassResponse {
  elements: OverpassElement[]
}

export interface OverpassElement {
  type: string
  id: number
  tags: { [key: string]: string | undefined }
}

export async function queryOverpass(query: string) {
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `data=${encodeURIComponent(query)}`
  })

  if (!response.ok) {
    throw new Error(`Failed to query Overpass API: ${response.statusText}`)
  }

  return response.json() as Promise<OverpassResponse>
}