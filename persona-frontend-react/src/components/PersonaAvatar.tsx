import { useState } from "react"

import { cn } from "@/lib/utils"

interface PersonaAvatarProps {
  initials: string
  avatarUrl?: string
  avatarImageClassName?: string
  size?: "sm" | "md"
}

const sizeClasses: Record<NonNullable<PersonaAvatarProps["size"]>, string> = {
  sm: "size-10 text-sm",
  md: "size-14 text-lg",
}

export function PersonaAvatar({
  initials,
  avatarUrl,
  avatarImageClassName,
  size = "md",
}: PersonaAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(avatarUrl) && !imageFailed

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-base border-2 border-border font-heading",
        showImage ? "bg-secondary-background" : "bg-main text-main-foreground",
        sizeClasses[size],
      )}
    >
      {showImage ? (
        <img
          src={avatarUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn("size-full object-cover", avatarImageClassName)}
          onError={() => setImageFailed(true)}
        />
      ) : (
        initials
      )}
    </div>
  )
}
