import { createBrowserRouter } from "react-router"

import { PersonaSelectPage } from "@/features/persona-select/PersonaSelectPage"
import { ChatPage } from "@/features/chat/ChatPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PersonaSelectPage />,
  },
  {
    path: "/chat/:personaId",
    element: <ChatPage />,
  },
])
