"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const SliderWithLabel = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    subLabel?: [string, string];
  }
>(({ className, subLabel, ...props }, ref) => {
  const value = props.value || props.defaultValue;
  const itemsRef = React.useRef<Map<number, HTMLSpanElement> | null>(null);

  function getMap() {
    if (!itemsRef.current) {
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {value?.map((i, idx) => {
        return (
          <SliderPrimitive.Thumb
            key={i}
            ref={(node) => {
              const map = getMap();
              if (node) {
                map.set(idx, node);
              } else {
                map.delete(idx);
              }

              if (node) {
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                      const rect1 = map.get(0)!.getBoundingClientRect();
                      const rect2 = map.get(1)!.getBoundingClientRect();

                      const isIntersecting = !(
                        rect1.right + 2 * 16 < rect2.left ||
                        rect1.left > rect2.right
                      );

                      if (isIntersecting) {
                        (
                          map?.get(1)?.firstElementChild as HTMLElement
                        ).style.top = "-200%";
                      } else {
                        (
                          map?.get(1)?.firstElementChild as HTMLElement
                        ).style.top = "1rem";
                      }
                    }
                  });
                });
                observer.observe(map.get(0)!);
              }
            }}
            className="relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {subLabel !== undefined && (
              <div
                className={
                  "absolute top-4 text-sm right-0 left-1/2 -translate-x-1/2 w-fit cursor-grab"
                }
              >
                <span>{subLabel[idx]}</span>
              </div>
            )}
          </SliderPrimitive.Thumb>
        );
      })}
    </SliderPrimitive.Root>
  );
});
SliderWithLabel.displayName = SliderPrimitive.Root.displayName;

export { SliderWithLabel };
