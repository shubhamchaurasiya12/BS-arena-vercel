// D:\BS-arena-NextJS\app\components\HoverTab.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type HoverItem = {
  name: string;
  content: React.ReactNode;
};

type HoverTabProps = {
  items: HoverItem[];
  onActiveChange?: (name: string | null) => void;
};

export default function HoverTab({ items, onActiveChange }: HoverTabProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, top: 0 });
  const [tabDimensions, setTabDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeIndex !== null && contentRef.current) {
      const contentElement = contentRef.current;

      const contentWidth = contentElement.scrollWidth;
      const contentHeight = contentElement.scrollHeight;

      const padding = 40;

      setTabDimensions({
        width: contentWidth + padding,
        height: contentHeight + padding,
      });

      updateTabPosition(activeIndex, contentWidth + padding);
    }
  }, [activeIndex]);

  const updateTabPosition = useCallback(
    (index: number, tabWidth: number) => {
      const itemElement = itemRefs.current[index];
      if (!itemElement || !containerRef.current) return;

      const itemRect = itemElement.getBoundingClientRect();
      const containerRect =
        containerRef.current.getBoundingClientRect();

      const leftPosition =
        itemRect.left -
        containerRect.left +
        (itemRect.width - tabWidth) / 2;

      setTabPosition({
        left: Math.max(
          0,
          Math.min(leftPosition, containerRect.width - tabWidth)
        ),
        top: itemRect.height + 20,
      });
    },
    []
  );

  const handleMouseEnter = useCallback((index: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setActiveIndex(index);
    setIsHovering(true);

    const item = items[index];
    if (item) {
      onActiveChange?.(item.name);
    }
  }, [items, onActiveChange]);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setActiveIndex(null);
      onActiveChange?.(null);
    }, 200);
  }, [onActiveChange]);

  const getAccentColor = (index: number) => {
    const colors = [
      "var(--emerald)",
      "var(--violet)",
      "var(--amber)",
      "var(--crimson)",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-8">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const accentColor = getAccentColor(index);

          return (
            <div
              key={item.name}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="relative cursor-pointer group py-2"
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <span
                className="text-base font-semibold tracking-wide transition-all duration-300"
                style={{
                  color: isActive
                    ? accentColor
                    : "var(--text-1)",
                  fontSize: "1rem",
                }}
              >
                {item.name}
              </span>

              <span
                className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300"
                style={{
                  width: isActive ? "100%" : "0%",
                  background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
                  height: "2px",
                }}
              />
            </div>
          );
        })}
      </div>

      {isHovering && activeIndex !== null && items[activeIndex] && (
        <div
          ref={tabRef}
          className="absolute z-50"
          style={{
            left: `${tabPosition.left}px`,
            top: `${tabPosition.top}px`,
            width: `${tabDimensions.width}px`,
            opacity: isHovering ? 1 : 0,
            transform: `translateY(${isHovering ? "0" : "-10px"})`,
            transition:
              "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={() => {
            if (timeoutRef.current)
              clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <div
              className="relative bg-[var(--ink)] border border-[var(--line)] rounded-xl shadow-2xl overflow-hidden"
              style={{
                boxShadow:
                  "0 20px 40px -10px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${getAccentColor(
                    activeIndex
                  )} 0%, transparent 100%)`,
                  height: "4px",
                }}
              />

              <div ref={contentRef} className="p-8">
                {items[activeIndex]?.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}