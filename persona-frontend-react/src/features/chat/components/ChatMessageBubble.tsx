import { memo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { BotIcon, UserIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"
import type { ChatMessage } from "../types/chat.types"

interface ChatMessageBubbleProps {
  message: ChatMessage
}

function ThinkingIndicator() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Thinking">
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-current" />
    </span>
  )
}

function ChatMessageBubbleImpl({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user"
  const isThinking = message.status === "streaming" && message.content === ""

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      <div
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground"
      >
        <HugeiconsIcon icon={isUser ? UserIcon : BotIcon} size={18} />
      </div>
      <div
        className={cn(
          "max-w-[75%] rounded-base border-2 border-border px-4 py-2 shadow-shadow",
          isUser ? "bg-main text-main-foreground" : "bg-background text-foreground",
          message.status === "error" && "bg-secondary-background text-foreground",
        )}
      >
        {isThinking ? (
          <ThinkingIndicator />
        ) : (
          <p className="whitespace-pre-wrap">
            {message.content}
            {message.status === "streaming" && (
              <span
                className="ml-0.5 inline-block w-2 animate-pulse"
                aria-hidden="true"
              >
                ▍
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}

export const ChatMessageBubble = memo(ChatMessageBubbleImpl)
