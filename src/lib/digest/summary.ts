import OpenAI from "openai"
import type { CloseCallReport } from "@prisma/client"

export async function summarizeReports(reports: CloseCallReport[]) {
  const formattedReports = reports
    .map((report) => (
      `Transportation Mode: ${report.transportationMode}\n` +
      `User Description: "${report.description ?? "(no description provided)"}"\n` +
      `----`
    ))
    .join("\n")

  const openai = new OpenAI()
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "system",
      content: "You will be given a list of user-provided descriptions about near-misses with vehicles. These incidents all happened in the same area. Provide a summary of these incidents in a short sentence or two. Only provide the summary, with no preface or quotes. Focus on common patterns or alarming behavior."
    }, {
      role: "user",
      content: formattedReports
    }],
    temperature: 0.9
  })

  return response.choices[0].message.content
}