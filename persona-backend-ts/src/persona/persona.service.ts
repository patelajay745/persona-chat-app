import type { messageArrayTypes } from "@/types/messageArrayTypes.ts";
import { generateSystemPrompt, PERSONAS, type Persona } from "@/constants/systemPrompts.ts";
import { openAIClient } from "@/utils/openAi";

class PersonaService {
  constructor(private persona: Persona) {}

  async generateReply(messages: messageArrayTypes[]) {
    const SystemPrompt = generateSystemPrompt(this.persona);

    messages.unshift({ role: "system", content: SystemPrompt });

    const aiReply = await openAIClient.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
    });

    return aiReply.choices[0]?.message.content;
  }

  async streamReply(messages: messageArrayTypes[]) {
    const SystemPrompt = generateSystemPrompt(this.persona);

    messages.unshift({ role: "system", content: SystemPrompt });

    const aiReply = await openAIClient.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: messages,
      stream: true,
    });

    return aiReply;
  }
}

const personaServices = Object.fromEntries(
  PERSONAS.map((persona) => [persona, new PersonaService(persona)]),
) as Record<Persona, PersonaService>;

export const getPersonaService = (persona: Persona) => personaServices[persona];
