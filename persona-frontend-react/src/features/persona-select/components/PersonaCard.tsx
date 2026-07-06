import { memo, forwardRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Persona } from "@/types/persona.types"

interface PersonaCardProps {
  persona: Persona
  selected: boolean
  tabIndex: number
  onSelect: (id: Persona["id"]) => void
}

function PersonaCardImpl(
  { persona, selected, tabIndex, onSelect }: PersonaCardProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <Card
      ref={ref}
      role="option"
      aria-selected={selected}
      tabIndex={tabIndex}
      onClick={() => onSelect(persona.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect(persona.id)
        }
      }}
      className="group relative min-h-96 cursor-pointer select-none justify-end gap-1 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
    >
      <img
        src={persona.avatarUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-white via-white/60 to-transparent" />

      <CardHeader className="relative z-10 bg-transparent">
        <CardTitle className="text-2xl text-black">{persona.displayName}</CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 bg-transparent">
        <CardDescription className="text-black/80">{persona.tagline}</CardDescription>
      </CardContent>

      <CardFooter className="relative z-10 bg-transparent">
        <Button
          type="button"
          size="sm"
          onClick={(event) => {
            event.stopPropagation()
            onSelect(persona.id)
          }}
        >
          Chat with {persona.displayName}
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </CardFooter>
    </Card>
  )
}

export const PersonaCard = memo(
  forwardRef<HTMLDivElement, PersonaCardProps>(PersonaCardImpl),
)
