import { z } from "zod"

export const chatRoleSchema = z.enum(["user", "assistant"])

export const chatMessageSchema = z.object({
  role: chatRoleSchema,
  content: z.string(),
})

export const chatHistorySchema = z.array(chatMessageSchema)

export const sseChunkSchema = z.object({
  content: z.string(),
})
