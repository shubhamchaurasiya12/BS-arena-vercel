"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type HoverItem = {
  name: string;
  content: string;
};

type HoverTabProps = {
  items: HoverItem[];
};

export default function HoverTab({ items }: HoverTabProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [tabPosition, setTabPosition] = useState({ left: 0, top: 0 });
  const [tabDimensions, setTabDimensions] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Measure content dimensions when active index changes
  useEffect(() => {
    if (activeIndex !== null && contentRef.current && tabRef.current) {
      const contentElement = contentRef.current;
      
      // Temporarily make it visible to measure
      contentElement.style.opacity = '0';
      contentElement.style.position = 'absolute';
      
      // Get content dimensions
      const contentWidth = contentElement.scrollWidth;
      const contentHeight = contentElement.scrollHeight;
      
      const itemElement = itemRefs.current[activeIndex];
      const itemWidth = itemElement?.offsetWidth || 200;
      
      const padding = 48; // 24px on each side
      const minWidth = Math.max(itemWidth, 250); // Minimum width
      const calculatedWidth = Math.max(minWidth, contentWidth + padding);
      const calculatedHeight = contentHeight + padding;
      
      contentElement.style.opacity = '1';
      contentElement.style.position = 'relative';
      
      setTabDimensions({
        width: calculatedWidth,
        height: calculatedHeight
      });
      
      updateTabPosition(activeIndex, calculatedWidth);
    }
  }, [activeIndex]);

  const updateTabPosition = useCallback((index: number, tabWidth: number) => {
    const itemElement = itemRefs.current[index];
    if (!itemElement || !containerRef.current) return;

    const itemRect = itemElement.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const leftPosition = itemRect.left - containerRect.left + (itemRect.width - tabWidth) / 2;
    
    setTabPosition({
      left: Math.max(0, leftPosition),
      top: itemRect.height + 15
    });
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setActiveIndex(index);
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovering(false);
      setActiveIndex(null);
    }, 150);
  }, []);

  const handleTabMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex justify-end"
      onMouseLeave={handleMouseLeave}
    >
      {/* NAV ITEMS */}
      <div className="flex gap-10 items-center">
        {items.map((item, index) => (
          <div
            key={item.name}
            ref={el => itemRefs.current[index] = el}
            className="relative cursor-pointer group"
            onMouseEnter={() => handleMouseEnter(index)}
          >
            <div className="nav-link inline-block overflow-hidden whitespace-nowrap">
              {item.name.split("").map((letter, i) => (
                <span 
                  key={i} 
                  className="inline-block transition-transform duration-300 ease-out"
                  style={{ 
                    transitionDelay: `${i * 30}ms`,
                    transform: activeIndex === index ? 'translateY(-100%)' : 'translateY(0)'
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      {isHovering && activeIndex !== null && (
        <div
          ref={tabRef}
         className="absolute bg-[rgb(253,244,237)] border border-black rounded-2xl shadow-[6px_8px_1px_rgba(0,0,0,3)] z-50 overflow-hidden transition-all duration-300 ease-out"
          style={{
            left: `${tabPosition.left}px`,
            top: `${tabPosition.top}px`,
            width: `${tabDimensions.width}px`,
            minHeight: `${tabDimensions.height}px`,
            opacity: isHovering ? 1 : 0,
            transform: `translateY(${isHovering ? '0' : '-10px'})`,
          }}
          onMouseEnter={handleTabMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={contentRef}
            className="p-6 transition-all duration-300"
            style={{ opacity: tabDimensions.width > 0 ? 1 : 0 }}
          >
            <div className="text-sm font-medium text-black mb-2">
              {items[activeIndex].name}
            </div>
            <div className="text-black">
              {items[activeIndex].content}
            </div>
          </div>
        </div>
      )}

      {/* Global styles */}
      <style jsx global>{`
        /* Smooth dimension transitions */
        .hover-tab-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          transition-property: width, height, left, top, opacity, transform !important;
        }
      `}</style>
    </div>
  );
}