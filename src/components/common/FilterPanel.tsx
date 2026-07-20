import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";
import { COMMON_LABELS } from "@/constants/labels";
import { humanizeStatus } from "@/utils/string";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label?: string;
}

export interface FilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: readonly string[] | readonly FilterOption[];
  statusPlaceholder?: string;
  className?: string;
  children?: ReactNode;
}

function normalize(
  options: readonly string[] | readonly FilterOption[] | undefined,
): FilterOption[] {
  if (!options) return [];
  return options.map((o) =>
    typeof o === "string" ? { value: o, label: humanizeStatus(o) } : o,
  );
}

export function FilterPanel({
  search,
  onSearchChange,
  searchPlaceholder,
  statusValue,
  onStatusChange,
  statusOptions,
  statusPlaceholder = "Filter by status",
  className,
  children,
}: FilterPanelProps) {
  const options = normalize(statusOptions);
  const showStatus = options.length > 0 && onStatusChange;

  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {showStatus && (
          <Select value={statusValue} onValueChange={onStatusChange}>
            <SelectTrigger
              className="w-full sm:w-52"
              aria-label={statusPlaceholder}
            >
              <SelectValue placeholder={statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{COMMON_LABELS.ALL_STATUSES}</SelectItem>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label ?? humanizeStatus(o.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {children}
      </div>
    </div>
  );
}
