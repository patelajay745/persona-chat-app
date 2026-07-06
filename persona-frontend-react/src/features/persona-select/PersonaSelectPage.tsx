import { usePersonaSelection } from "./hooks/usePersonaSelection"
import { PersonaGrid } from "./components/PersonaGrid"

export function PersonaSelectPage() {
  const { selectedId, selectPersona } = usePersonaSelection()

  return (
    <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-heading text-3xl">Pick your persona</h1>
        <p className="text-foreground/80">
          Choose who you want to chat with — Hitesh or Piyush.
        </p>
      </div>
      <PersonaGrid selectedId={selectedId} onSelect={selectPersona} />
    </main>
  )
}
