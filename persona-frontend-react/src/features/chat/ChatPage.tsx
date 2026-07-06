import { Navigate, useParams } from "react-router"

import { PERSONAS } from "@/data/personas"
import type { Persona, PersonaId } from "@/types/persona.types"
import { ChatProvider } from "./context/ChatProvider"
import { useChat } from "./hooks/useChat"
import { useSidebarCollapsed } from "./hooks/useSidebarCollapsed"
import { ChatHeader } from "./components/ChatHeader"
import { ChatSidebar } from "./components/ChatSidebar"
import { ChatMessageList } from "./components/ChatMessageList"
import { ChatComposer } from "./components/ChatComposer"

const isPersonaId = (value: string | undefined): value is PersonaId =>
  PERSONAS.some((persona) => persona.id === value)

interface ChatPageContentProps {
  persona: Persona
}

function ChatPageContent({ persona }: ChatPageContentProps) {
  const { messages, isStreaming, messagesRemaining, sendMessage } = useChat()
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapsed()

  return (
    <div className="flex min-h-svh">
      <ChatSidebar
        activePersonaId={persona.id}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex min-w-0 flex-1 flex-col items-center">
        <div className="flex w-full max-w-4xl flex-1 flex-col">
          <ChatHeader persona={persona} />
          <ChatMessageList messages={messages} />
          <ChatComposer
            disabled={isStreaming}
            messagesRemaining={messagesRemaining}
            onSend={sendMessage}
          />
        </div>
      </div>
    </div>
  )
}

export function ChatPage() {
  const { personaId } = useParams<{ personaId: string }>()

  if (!isPersonaId(personaId)) {
    return <Navigate to="/" replace />
  }

  const persona = PERSONAS.find((p) => p.id === personaId)!

  return (
    <ChatProvider personaId={personaId} key={personaId}>
      <ChatPageContent persona={persona} />
    </ChatProvider>
  )
}
