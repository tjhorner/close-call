import OpenAI from "openai"
import type { ClusteredReport } from "./clusters"

export async function summarizeReports(reports: ClusteredReport[]) {
  const formattedReports = reports.map((report) => `(transportation mode: ${report.transportationMode}): ${report.description.trim().length === 0 ? "(no description)" : report.description.trim()}`).join("\n")

  const openai = new OpenAI()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: "You will be given a list of user-provided descriptions about near-misses with vehicles. These incidents all happened in the same geographic area (i.e., at the same intersection, for example). Provide a summary of these incidents in a sentence or two. Only provide the summary, with no preface or quotes."
    }, {
      role: "user",
      content: formattedReports
    }],
    temperature: 0.9
  })

  return response.choices[0].message.content
}