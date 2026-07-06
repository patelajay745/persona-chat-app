import { createContext } from "react"

import type { ChatMessage } from "../types/chat.types"

export interface ChatContextValue {
  messages: ChatMessage[]
  isStreaming: boolean
  messagesRemaining: number
  sendMessage: (content: string) => void
}

export const ChatContext = createContext<ChatContextValue | null>(null)
