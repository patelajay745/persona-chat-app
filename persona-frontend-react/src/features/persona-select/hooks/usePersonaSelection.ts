import { useCallback, useState } from "react"
import { useNavigate } from "react-router"

import type { PersonaId } from "@/types/persona.types"

export function usePersonaSelection() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<PersonaId | null>(null)

  const selectPersona = useCallback(
    (id: PersonaId) => {
      setSelectedId(id)
      navigate(`/chat/${id}`)
    },
    [navigate],
  )

  return { selectedId, selectPersona }
}
