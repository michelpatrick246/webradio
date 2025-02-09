"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface ExtendedSliderProps
    extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  myProps:string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  ExtendedSliderProps
>(({ className,myProps, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-100">
      <SliderPrimitive.Range style={{ backgroundColor: myProps }} className="absolute h-full " />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb style={{ backgroundColor: myProps }} className="block h-4 w-4 rounded-full   shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
