const STORAGE_KEY = "chat-message-count"

export const MAX_MESSAGES = 25

// No backend/DB involved by design (this is a demo project) — the count lives in
// localStorage, shared across all persona chats for a given browser. It's a soft
// guard, not a security measure: clearing storage resets it, and that's fine here.
export function getMessageCount(): number {
  try {
    const parsed = Number(window.localStorage.getItem(STORAGE_KEY))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
  } catch {
    return 0
  }
}

export function incrementMessageCount(): number {
  const next = getMessageCount() + 1
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next))
  } catch {
    // Storage can fail (quota exceeded, private browsing) — the limit just won't persist then.
  }
  return next
}
