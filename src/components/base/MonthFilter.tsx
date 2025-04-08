import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchBasesByMonths } from "@/api/baseApi";

interface MonthOption {
  monthYear: string;
  displayName: string;
  count: number;
}

interface MonthFilterProps {
  activeMonth: string | null;
  onMonthChange: (monthYear: string | null) => void;
}

export const MonthFilter = ({
  activeMonth,
  onMonthChange,
}: MonthFilterProps) => {
  const [months, setMonths] = useState<MonthOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMonths = async () => {
      try {
        const response = await fetchBasesByMonths();
        setMonths(response.data);
      } catch (error) {
        console.error("Error loading months:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMonths();
  }, []);

  const getDisplayText = () => {
    if (loading) return "Loading...";
    if (!activeMonth) return "All Time";
    const selectedMonth = months.find((m) => m.monthYear === activeMonth);
    return selectedMonth ? selectedMonth.displayName : "All Time";
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5
          text-sm font-medium transition-colors 
          hover:bg-accent hover:text-accent-foreground 
          active:bg-accent/80
          rounded-md"
          disabled={loading}
        >
          {getDisplayText()}
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[12rem] overflow-hidden rounded-md 
          border bg-popover p-1 text-popover-foreground shadow-md"
          sideOffset={4}
          align="end"
        >
          <DropdownMenu.Item
            className="relative flex cursor-default select-none 
              items-center rounded-sm px-4 py-3.5 text-sm outline-none 
              transition-colors hover:bg-accent hover:text-accent-foreground
              active:bg-accent/80"
            onClick={() => onMonthChange(null)}
          >
            All Time
          </DropdownMenu.Item>

          {months.map((month) => (
            <DropdownMenu.Item
              key={month.monthYear}
              className="relative flex cursor-default select-none 
                items-center justify-between rounded-sm px-4 py-3.5 text-sm outline-none 
                transition-colors hover:bg-accent hover:text-accent-foreground
                active:bg-accent/80"
              onClick={() => onMonthChange(month.monthYear)}
            >
              <span>{month.displayName}</span>
              <span className="text-muted-foreground ml-4">{month.count}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
