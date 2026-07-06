export type PersonaId = "hitesh" | "piyush"

export interface Persona {
  id: PersonaId
  displayName: string
  tagline: string
  initials: string
  avatarUrl: string
  /** Extra Tailwind classes for the avatar <img>, e.g. to zoom past a source photo's transparent padding. */
  avatarImageClassName?: string
}
