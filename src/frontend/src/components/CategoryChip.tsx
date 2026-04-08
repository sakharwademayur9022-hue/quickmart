import { cn } from "@/lib/utils";
import type { Category } from "../types";

const CATEGORIES: { value: Category | null; label: string; emoji: string }[] = [
  { value: null, label: "All", emoji: "🛒" },
  { value: "Fruits", label: "Fruits", emoji: "🍎" },
  { value: "Vegetables", label: "Vegetables", emoji: "🥦" },
  { value: "Dairy", label: "Dairy", emoji: "🥛" },
  { value: "Snacks", label: "Snacks", emoji: "🍟" },
  { value: "Beverages", label: "Beverages", emoji: "🧃" },
  { value: "Bakery", label: "Bakery", emoji: "🍞" },
  { value: "Meat", label: "Meat", emoji: "🥩" },
  { value: "PersonalCare", label: "Personal Care", emoji: "🧴" },
  { value: "Household", label: "Household", emoji: "🧹" },
];

interface CategoryChipProps {
  active: Category | null;
  onChange: (category: Category | null) => void;
}

export default function CategoryChip({ active, onChange }: CategoryChipProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4"
      role="tablist"
      aria-label="Product categories"
    >
      {CATEGORIES.map(({ value, label, emoji }) => {
        const isActive = active === value;
        return (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all shrink-0",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-foreground border-border hover:border-primary/40 hover:bg-primary/5",
            )}
            data-ocid={`category-chip-${value ?? "all"}`}
          >
            <span className="text-base leading-none">{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export { CATEGORIES };
