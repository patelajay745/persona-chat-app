import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import type { PersonaId } from "@/types/persona.types"
import { loadChatHistory, saveChatHistory } from "../storage/chatStorage"
import {
  MAX_MESSAGES,
  getMessageCount,
  incrementMessageCount,
} from "../storage/messageLimitStorage"
import type { ChatMessage } from "../types/chat.types"
import { useSendMessageMutation } from "../hooks/useSendMessageMutation"
import { ChatContext } from "./ChatContext"

interface ChatProviderProps {
  personaId: PersonaId
  children: ReactNode
}

let nextMessageId = 0
const createMessageId = () => `msg-${Date.now()}-${nextMessageId++}`

export function ChatProvider({ personaId, children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadChatHistory(personaId).map((message) => ({
      ...message,
      id: createMessageId(),
      status: "complete",
    })),
  )
  const abortControllerRef = useRef<AbortController | null>(null)
  const sendMessageMutation = useSendMessageMutation()
  const isStreaming = sendMessageMutation.isPending
  const [messagesRemaining, setMessagesRemaining] = useState(
    () => MAX_MESSAGES - getMessageCount(),
  )

  useEffect(() => {
    if (isStreaming) return
    saveChatHistory(
      personaId,
      messages.map(({ role, content }) => ({ role, content })),
    )
  }, [messages, isStreaming, personaId])

  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [personaId])

  const sendMessage = (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isStreaming || messagesRemaining <= 0) return

    setMessagesRemaining(MAX_MESSAGES - incrementMessageCount())

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      status: "complete",
    }
    const assistantMessageId = createMessageId()
    const historyForApi = [
      ...messages.map(({ role, content: text }) => ({ role, content: text })),
      { role: userMessage.role, content: userMessage.content },
    ]

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantMessageId, role: "assistant", content: "", status: "streaming" },
    ])

    const controller = new AbortController()
    abortControllerRef.current = controller

    sendMessageMutation.mutate(
      {
        personaId,
        messages: historyForApi,
        signal: controller.signal,
        onToken: (token) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessageId
                ? { ...message, content: message.content + token }
                : message,
            ),
          )
        },
      },
      {
        onError: (error) => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    status: "error",
                    content:
                      message.content ||
                      error.message ||
                      "Something went wrong while getting a reply. Please try again.",
                  }
                : message,
            ),
          )
        },
        onSettled: () => {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantMessageId && message.status === "streaming"
                ? { ...message, status: "complete" }
                : message,
            ),
          )
        },
      },
    )
  }

  const value = useMemo(
    () => ({ messages, isStreaming, messagesRemaining, sendMessage }),
    // sendMessage is redefined every render (it closes over messages/isStreaming);
    // omitted intentionally so the memo only invalidates when its data actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messages, isStreaming, messagesRemaining, personaId],
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
