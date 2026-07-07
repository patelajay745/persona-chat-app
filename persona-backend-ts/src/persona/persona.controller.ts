import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asyncHandler";
import type { Request, Response } from "express";
import type { messageArrayTypes } from "@/types/messageArrayTypes.ts";
import { PERSONAS, type Persona } from "@/constants/systemPrompts.ts";
import { getPersonaService } from "./persona.service";

const resolvePersona = (rawPersona: string): Persona => {
  const persona =
   PERSONAS.find((p) => p.toLowerCase() === rawPersona.toLowerCase())
      

  if (!persona) {
    throw new ApiError(
      400,
      `Unknown persona "${rawPersona}". Available personas: ${PERSONAS.join(", ")}`,
    );
  }

  return persona;
};

export const generateReply = asyncHandler(async (req: Request, res: Response) => {
  const persona = resolvePersona(req.params.persona as string);
  const { messages } = req.body as { messages: messageArrayTypes[] };

  const reply = await getPersonaService(persona).generateReply(messages);

  return res.status(201).json(new ApiResponse(201, "ai is replyed", {
    reply,
  }));
});

export const streamReply = asyncHandler(async (req: Request, res: Response) => {
  const persona = resolvePersona(req.params.persona as string);
  const { messages } = req.body as { messages: messageArrayTypes[] };

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const stream = await getPersonaService(persona).streamReply(messages);

  req.on("close", () => {
    stream.controller.abort();
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;

    if (content) {
      res.write(`data:${JSON.stringify({ content })}\n\n`);
    }
  }

  res.write("event: done\ndata:[DONE]\n\n");

  res.end();
});
