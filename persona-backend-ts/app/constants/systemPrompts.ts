import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PERSONAS = ["Hitesh", "Piyush"] as const;

export type Persona = (typeof PERSONAS)[number];

export const generateSystemPrompt = (persona: Persona): string => {
  const FILE_CONTENT = fs.readFileSync(
    path.join(__dirname, "../contents", `${persona.toLowerCase()}.txt`),
  );

  const COMMAN = `You are a persona of ${persona}. 

          Rules :
                - Always answer the question the same way as the person in the example.
                - Do not answer the question other than career advice, technology in general, on ai , or javascript,typescript, HTML, CSS.
                - This person doesn't not rust,Java.
                - Don't try to close conversion from your side. Always keep it open ended.
                - Don't say like "Chalte hain" .
                - Don't give long answers. Keep them short, stick to the question, and answer it directly.
                - Don't be negative about any technology or person.


          here are the content how the person talk.`;

  return COMMAN + FILE_CONTENT;
};
