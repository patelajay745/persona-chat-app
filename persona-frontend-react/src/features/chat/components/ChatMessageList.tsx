import { useEffect } from "react"
import { useLenis } from "lenis/react"

import type { ChatMessage } from "../types/chat.types"
import { ChatMessageBubble } from "./ChatMessageBubble"

interface ChatMessageListProps {
  messages: ChatMessage[]
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

  
    lenis.resize()
   
    lenis.scrollTo(document.documentElement.scrollHeight, { lerp: 0.1 })
  }, [messages, lenis])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      className="flex flex-1 flex-col gap-4 px-4 py-6"
    >
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}
