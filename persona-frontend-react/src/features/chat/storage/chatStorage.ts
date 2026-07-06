import type { PersonaId } from "@/types/persona.types"
import { chatHistorySchema } from "../schemas/chat.schemas"
import type { PersistedChatMessage } from "../types/chat.types"

const storageKey = (personaId: PersonaId) => `persona-chat:${personaId}`

export function loadChatHistory(personaId: PersonaId): PersistedChatMessage[] {
  try {
    const raw = window.localStorage.getItem(storageKey(personaId))
    if (!raw) return []

    const parsed = chatHistorySchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

export function saveChatHistory(
  personaId: PersonaId,
  messages: PersistedChatMessage[],
): void {
  try {
    window.localStorage.setItem(storageKey(personaId), JSON.stringify(messages))
  } catch {
    // Storage can fail (quota exceeded, private browsing) — chat still works in-memory.
  }
}
