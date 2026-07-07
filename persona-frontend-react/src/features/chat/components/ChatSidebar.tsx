import { Link } from "react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "@hugeicons/core-free-icons"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { PERSONAS } from "@/data/personas"
import { PersonaAvatar } from "@/components/PersonaAvatar"
import type { PersonaId } from "@/types/persona.types"

interface ChatSidebarProps {
  activePersonaId: PersonaId
  collapsed: boolean
  onToggleCollapsed: () => void
}

const SIDEBAR_WIDTH = { expanded: 256, collapsed: 80 }
const SIDEBAR_TRANSITION = { duration: 0.25, ease: "easeInOut" as const }

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: "auto" }}
      exit={{ opacity: 0, width: 0 }}
      transition={SIDEBAR_TRANSITION}
      className="overflow-hidden whitespace-nowrap"
    >
      {children}
    </motion.span>
  )
}

export function ChatSidebar({
  activePersonaId,
  collapsed,
  onToggleCollapsed,
}: ChatSidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded }}
      transition={SIDEBAR_TRANSITION}
      className="sticky top-0 hidden h-svh shrink-0 md:flex"
    >
      <div className="flex h-full w-full flex-col gap-4 overflow-x-hidden overflow-y-auto border-r-2 border-border bg-background p-4">
        <Link
          to="/"
          aria-label="All personas"
          className={cn(
            "flex items-center gap-2 rounded-base border-2 border-border bg-secondary-background text-sm font-heading text-foreground shadow-shadow transition-all duration-200 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
            collapsed ? "size-10 justify-center" : "px-3 py-2",
          )}
        >
          <HugeiconsIcon icon={Home01Icon} size={16} className="shrink-0" />
          <AnimatePresence initial={false}>
            {!collapsed && <SidebarLabel>All personas</SidebarLabel>}
          </AnimatePresence>
        </Link>

        <nav
          className={cn("flex flex-col gap-2", collapsed && "items-center")}
          aria-label="Switch persona"
        >
          {PERSONAS.map((persona) => {
            const isActive = persona.id === activePersonaId
            return (
              <Link
                key={persona.id}
                to={`/chat/${persona.id}`}
                aria-current={isActive ? "page" : undefined}
                aria-label={persona.displayName}
                title={collapsed ? persona.displayName : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-base transition-all duration-200",
                  collapsed
                    ? cn(
                        "size-10 justify-center",
                        isActive &&
                          "ring-2 ring-border ring-offset-2 ring-offset-background",
                      )
                    : cn(
                        "border-2 border-border px-3 py-2",
                        isActive
                          ? "bg-main text-main-foreground shadow-shadow"
                          : "bg-secondary-background text-foreground",
                      ),
                )}
              >
                <PersonaAvatar
                  initials={persona.initials}
                  avatarUrl={persona.avatarUrl}
                  avatarImageClassName={persona.avatarImageClassName}
                  size="sm"
                />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <SidebarLabel>
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm">
                          {persona.displayName}
                        </p>
                        <p
                          className={cn(
                            "truncate text-xs",
                            isActive ? "opacity-80" : "opacity-60",
                          )}
                        >
                          {persona.tagline}
                        </p>
                      </div>
                    </SidebarLabel>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        className="absolute right-0 bottom-10 z-20 flex translate-x-1/2 items-center justify-center rounded-base border-2 border-border bg-secondary-background p-2 text-foreground"
      >
        <HugeiconsIcon icon={collapsed ? PanelLeftCloseIcon : PanelLeftOpenIcon} size={16} />
      </button>
    </motion.aside>
  )
}
