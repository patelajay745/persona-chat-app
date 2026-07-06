import { z } from "zod"

import type { PersonaId } from "@/types/persona.types"
import { sseChunkSchema } from "../schemas/chat.schemas"
import type { PersistedChatMessage } from "../types/chat.types"

const apiErrorBodySchema = z.object({ message: z.string() })

/** Surfaces the backend's own error message (e.g. the 429 message-limit text) instead of a generic one. */
async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const parsed = apiErrorBodySchema.safeParse(await response.json())
    if (parsed.success && parsed.data.message) return parsed.data.message
  } catch {
    // Response body wasn't JSON — fall through to the generic message below.
  }
  return `Persona reply request failed with status ${response.status}`
}

/**
 * Parses whatever complete `\n\n`-delimited SSE events are present in `buffer`,
 * invoking `onToken` for each, and returns the trailing incomplete event (if any)
 * so the caller can prepend it to the next chunk of text.
 */
function consumeSseEvents(buffer: string, onToken: (token: string) => void): string {
  const events = buffer.split("\n\n")
  const incompleteTail = events.pop() ?? ""

  for (const event of events) {
    const dataLine = event.split("\n").find((line) => line.startsWith("data:"))
    if (!dataLine) continue

    const payload = dataLine.slice("data:".length).trim()
    if (payload === "[DONE]") continue

    const parsedChunk = sseChunkSchema.safeParse(JSON.parse(payload))
    if (parsedChunk.success) onToken(parsedChunk.data.content)
  }

  return incompleteTail
}

interface StreamPersonaReplyArgs {
  personaId: PersonaId
  messages: PersistedChatMessage[]
  onToken: (token: string) => void
  signal?: AbortSignal
}

/**
 * Reads the backend's SSE response via `fetch`'s ReadableStream, decoding and
 * parsing bytes as they arrive off the network. This is deliberately not
 * axios: axios's browser adapter is XHR-based, which only exposes the growing
 * `responseText` on throttled/batched progress ticks — that made the stream
 * render in visible bursts instead of smoothly token-by-token.
 */
export async function streamPersonaReply({
  personaId,
  messages,
  onToken,
  signal,
}: StreamPersonaReplyArgs): Promise<void> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/v1/persona/${personaId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    },
  )

  if (!response.ok || !response.body) {
    throw new Error(await extractErrorMessage(response))
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    buffer = consumeSseEvents(buffer, onToken)
  }
}
