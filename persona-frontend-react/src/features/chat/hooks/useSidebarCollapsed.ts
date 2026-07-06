import { useEffect, useState } from "react"

const STORAGE_KEY = "chat-sidebar-collapsed"

function readStoredValue(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(readStoredValue)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // Storage can fail (quota exceeded, private browsing) — the toggle still works in-memory.
    }
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}
