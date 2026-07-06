import { useMutation } from "@tanstack/react-query"

import type { PersonaId } from "@/types/persona.types"
import { streamPersonaReply } from "../api/personaChatClient"
import type { PersistedChatMessage } from "../types/chat.types"

interface SendMessageVariables {
  personaId: PersonaId
  messages: PersistedChatMessage[]
  signal: AbortSignal
  onToken: (token: string) => void
}

export function useSendMessageMutation() {
  return useMutation({
    mutationFn: (variables: SendMessageVariables) => streamPersonaReply(variables),
  })
}
