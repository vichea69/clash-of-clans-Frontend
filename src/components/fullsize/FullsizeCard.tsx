import { memo, useCallback, useMemo } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Copy } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Base } from "@/types/base";
import { formatDate } from "@/utils/formatDate";

interface FullsizeCardProps {
  component: Base;
}

export const FullsizeCard = memo(({ component }: FullsizeCardProps) => {
  const { user, isSignedIn } = useUser();

  const isCreator = useMemo(
    () => isSignedIn && user?.id === component.clerkUserId,
    [isSignedIn, user?.id, component.clerkUserId]
  );

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(component.link || window.location.href);
    toast.success("Link copied", {
      duration: 2000,
      position: window.innerWidth < 640 ? "top-center" : "bottom-right",
    });
  }, [component.link]);

  const avatarUrl = useMemo(() => {
    if (isCreator && user?.imageUrl) {
      return user.imageUrl;
    }
    return component.user?.avatar || "/placeholder.svg";
  }, [isCreator, user?.imageUrl, component.user?.avatar]);

  const userName = useMemo(() => {
    if (isCreator) {
      return user?.username || user?.firstName || "You";
    }
    return component.user?.name || "Unknown user";
  }, [isCreator, user?.username, user?.firstName, component.user?.name]);

  return (
    <div className="group relative rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-md transform hover:translate-y-[-5px]">
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 
          rounded-md bg-background/90 p-2 sm:p-2.5
          opacity-0 group-hover:opacity-100 transition-all duration-300
          border border-border/40 shadow-sm
          hover:bg-accent hover:text-accent-foreground
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </button>

      {isCreator && (
        <Badge
          variant="secondary"
          className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10
            text-[10px] sm:text-xs font-medium"
        >
          Your Upload
        </Badge>
      )}

      <a href={component.link} className="block touch-manipulation">
        <div className="relative overflow-hidden w-full">
          {/* Fallback content */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl font-medium">
            {component.name.charAt(0).toUpperCase()}
          </div>

          {/* Image with lazy loading */}
          {component.imageUrl && (
            <img
              src={component.imageUrl}
              alt={component.name}
              className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <div className="p-2 sm:p-3 md:p-4">
          <div className="flex justify-between items-end">
            <div className="flex items-center flex-1">
              <Avatar.Root className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full overflow-hidden border flex-shrink-0">
                <Avatar.Image
                  src={avatarUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-muted text-[10px] sm:text-xs">
                  {userName[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="ml-1.5 sm:ml-2 overflow-hidden">
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                  by {userName}
                </span>
              </div>
            </div>
            {component.createdAt && (
              <span className="text-[10px] sm:text-xs text-muted-foreground ml-2">
                {formatDate(component.createdAt)}
              </span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
});

FullsizeCard.displayName = "FullsizeCard"; 