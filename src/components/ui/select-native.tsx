"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled native <select> element — same visual style as the post-job-form selects.
 * Lighter and more performant than the Radix-based Select component.
 */
export const NativeSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "appearance-none border h-9 block rounded-sm px-2 pr-8 py-1.5 w-full text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-white cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <ChevronDown size={16} />
    </div>
  </div>
));

NativeSelect.displayName = "NativeSelect";
