import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={`peer h-5 w-5 shrink-0 rounded-md border-2 border-green-500 bg-white transition-all
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
               disabled:cursor-not-allowed disabled:opacity-50
               data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500
               ${className || ""}`}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-4 w-4 stroke-[3]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };