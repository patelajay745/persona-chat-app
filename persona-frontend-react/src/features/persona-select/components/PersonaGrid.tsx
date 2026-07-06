import { useRef, useState } from "react"

import { PERSONAS } from "@/data/personas"
import type { PersonaId } from "@/types/persona.types"
import { PersonaCard } from "./PersonaCard"

interface PersonaGridProps {
  selectedId: PersonaId | null
  onSelect: (id: PersonaId) => void
}

export function PersonaGrid({ selectedId, onSelect }: PersonaGridProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  const focusOption = (index: number) => {
    const nextIndex = (index + PERSONAS.length) % PERSONAS.length
    setActiveIndex(nextIndex)
    optionRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="listbox"
      aria-label="Choose a persona"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault()
          focusOption(activeIndex + 1)
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault()
          focusOption(activeIndex - 1)
        }
      }}
    >
      {PERSONAS.map((persona, index) => (
        <PersonaCard
          key={persona.id}
          ref={(node) => {
            optionRefs.current[index] = node
          }}
          persona={persona}
          selected={selectedId === persona.id}
          tabIndex={index === activeIndex ? 0 : -1}
          onSelect={(id) => {
            setActiveIndex(index)
            onSelect(id)
          }}
        />
      ))}
    </div>
  )
}
