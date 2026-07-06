import { useState, type KeyboardEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"

interface ChatComposerProps {
  disabled: boolean
  messagesRemaining: number
  onSend: (content: string) => void
}

export function ChatComposer({ disabled, messagesRemaining, onSend }: ChatComposerProps) {
  const [draft, setDraft] = useState("")
  const limitReached = messagesRemaining <= 0

  const submit = () => {
    if (!draft.trim() || disabled || limitReached) return
    onSend(draft)
    setDraft("")
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  if (limitReached) {
    return (
      <div className="sticky bottom-0 z-10 border-t-2 border-border bg-background p-4 text-center text-sm text-foreground/70">
        You've reached the demo's 25-message limit. Thanks for chatting!
      </div>
    )
  }

  return (
    <form
      className="sticky bottom-0 z-10 flex flex-col gap-2 border-t-2 border-border bg-background p-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className="flex items-end gap-3">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          aria-label="Message"
          className="max-h-40 min-h-10 flex-1 resize-none rounded-base border-2 border-border bg-background px-3 py-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        />
        <Button type="submit" size="icon" disabled={disabled || !draft.trim()}>
          <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
      <p className="text-right text-xs text-foreground/60">
        {messagesRemaining} message{messagesRemaining === 1 ? "" : "s"} left in this demo
      </p>
    </form>
  )
}
