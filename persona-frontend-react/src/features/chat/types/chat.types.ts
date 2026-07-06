import type { z } from "zod"

import type { chatMessageSchema, chatRoleSchema } from "../schemas/chat.schemas"

export type ChatRole = z.infer<typeof chatRoleSchema>
export type PersistedChatMessage = z.infer<typeof chatMessageSchema>

export type ChatMessageStatus = "complete" | "streaming" | "error"

export interface ChatMessage extends PersistedChatMessage {
  id: string
  status: ChatMessageStatus
}
