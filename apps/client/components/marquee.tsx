import React, { useEffect, useRef, useState } from 'react';

function Marquee({
  text,
  speed = 8,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [parentWidth, setParentWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current) {
      setParentWidth(parentRef.current.scrollWidth);
    }

    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, [text]);

  return (
    <div
      className={`overflow-hidden whitespace-nowrap ${className}`}
      ref={parentRef}
    >
      <style>
        {`
          @keyframes marquee {
              0% { transform: translateX(${parentWidth}px); }
              100% { transform: translateX(-${contentWidth * 3}px); }
          }
        `}
      </style>
      <div
        ref={contentRef}
        className="inline-block"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
}

export default Marquee;
