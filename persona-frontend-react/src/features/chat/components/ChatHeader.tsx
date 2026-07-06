import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"

import { PersonaAvatar } from "@/components/PersonaAvatar"
import type { Persona } from "@/types/persona.types"

interface ChatHeaderProps {
  persona: Persona
}

export function ChatHeader({ persona }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b-2 border-border bg-background p-4">
      <Link
        to="/"
        aria-label="Back to persona selection"
        className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
      </Link>
      <PersonaAvatar
        initials={persona.initials}
        avatarUrl={persona.avatarUrl}
        avatarImageClassName={persona.avatarImageClassName}
      />
      <div>
        <h1 className="font-heading text-lg">{persona.displayName}</h1>
        <p className="text-sm text-foreground/70">{persona.tagline}</p>
      </div>
    </header>
  )
}
