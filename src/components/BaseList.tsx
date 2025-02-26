import { Copy, MoreVertical, Pencil, Trash } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState, useCallback, memo } from "react";
import { fetchBases } from "@/api/baseApi";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useBaseActions } from "@/hooks/useBaseActions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Define proper interface based on BaseList.tsx
interface Base {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  user: {
    name: string;
    avatar?: string;
  };
  clerkUserId?: string;
}

// Base card component
const BaseCard = memo(
  ({ base, onBaseChange }: { base: Base; onBaseChange?: () => void }) => {
    const { user, isSignedIn } = useUser();
    const navigate = useNavigate();
    const { deleteBase } = useBaseActions(base.id.toString());

    const copyLink = useCallback(() => {
      navigator.clipboard.writeText(base.link || window.location.href);
      toast.success("Link copied", {
        duration: 2000,
        position: window.innerWidth < 640 ? "top-center" : "bottom-right",
      });
    }, [base.link]);

    const isCreator = isSignedIn && user?.id === base.clerkUserId;

    const handleEdit = () => {
      navigate(`/bases/${base.id}/edit`);
    };

    const handleDelete = async () => {
      const success = await deleteBase();
      if (success && onBaseChange) {
        onBaseChange();
      }
    };

    return (
      <div className="group relative rounded-lg border overflow-hidden transition-all duration-200 hover:shadow-md">
        <button
          onClick={copyLink}
          aria-label="Copy link"
          className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 z-10 
          rounded-md bg-background/90 p-2 sm:p-2.5
          transition-all duration-200
          border border-border/40 shadow-sm
          hover:bg-accent hover:text-accent-foreground
          active:scale-95
          focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        {isCreator && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10 
                rounded-md bg-background/90 p-2 sm:p-2.5
                transition-all duration-200
                border border-border/40 shadow-sm
                hover:bg-accent hover:text-accent-foreground
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[8rem] overflow-hidden rounded-md 
                border bg-popover p-1.5 text-popover-foreground shadow-md"
                sideOffset={4}
                align="end"
              >
                <DropdownMenu.Item
                  className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm
                  transition-colors
                  border border-transparent
                  hover:bg-accent hover:text-accent-foreground
                  focus:bg-accent focus:text-accent-foreground
                  focus:outline-none"
                  onClick={handleEdit}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenu.Item>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenu.Item
                      className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm
                      transition-colors text-destructive
                      border border-transparent
                      hover:bg-destructive hover:text-destructive-foreground
                      focus:bg-destructive focus:text-destructive-foreground
                      focus:outline-none"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenu.Item>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your base.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="mt-2 sm:mt-0 border border-border/40">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground
                        hover:bg-destructive/90
                        border border-destructive/40"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}

        <a href={base.link} className="block touch-manipulation">
          <div className="aspect-square relative overflow-hidden">
            <img
              src={base.imageUrl || "/placeholder.svg"}
              alt={base.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="p-2 sm:p-3 md:p-4">
            <div className="flex items-center">
              <Avatar.Root className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 rounded-full overflow-hidden border flex-shrink-0">
                <Avatar.Image
                  src={base.user?.avatar || "/placeholder.svg"}
                  alt={base.user?.name || "Unknown"}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="flex h-full w-full items-center justify-center bg-muted text-[10px] sm:text-xs">
                  {(base.user?.name || "U")[0]}
                </Avatar.Fallback>
              </Avatar.Root>
              <div className="ml-1.5 sm:ml-2 overflow-hidden flex-1 min-w-0">
                <span className="font-medium text-xs sm:text-sm md:text-base truncate block">
                  {base.name}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate block">
                  by{" "}
                  {isSignedIn && isCreator
                    ? user?.username || user?.firstName || "You"
                    : base.user?.name || "Unknown user"}
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }
);

// Skeleton loader component
const SkeletonCard = () => (
  <div className="rounded-lg border overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-3 sm:p-4">
      <div className="flex items-center">
        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="ml-2 flex-1 min-w-0">
          <div className="h-4 w-full max-w-[120px] bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const BaseList = () => {
  const [bases, setBases] = useState<Base[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadBases = async () => {
      try {
        setLoading(true);
        const basesData = await fetchBases();

        if (Array.isArray(basesData)) {
          setBases(basesData);
        } else {
          setError(
            "Expected an array of bases but received a different format"
          );
          console.error("Unexpected data format:", basesData);
        }
      } catch (err) {
        console.error("Error loading bases:", err);
        setError("Failed to load bases. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadBases();
  }, [retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((count) => count + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 px-4 sm:px-6 sm:py-6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 sm:p-8 text-center rounded-lg border border-red-200 bg-red-50 text-red-500">
            <p className="font-medium mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-5 py-3 bg-red-100 hover:bg-red-200 active:bg-red-300
                rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : bases.length === 0 ? (
          <div className="p-6 text-center rounded-lg border bg-background">
            <p className="text-muted-foreground">No bases available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bases.map((base) => (
              <BaseCard key={base.id} base={base} onBaseChange={handleRetry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BaseList;
