"use client";
import React, { useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function DraggableTimeline() {
  // SVG settings (match je huidige)
  const W = 1000;
  const H = 100;

  // Lijn padding / bounds
  const xMin = 8;
  const xMax = 992;
  const yLine = 40;

  // Je diamonds
  const diamonds = useMemo(
    () => [100, 210, 290, 350, 450, 540, 645, 710, 820, 900],
    []
  );

  // Draggable bolletje positie (start)
  const [x, setX] = useState(350);
  const [dragging, setDragging] = useState(false);

  const svgRef = useRef(null);
  const activePointerId = useRef(null);

  function clientXToSvgX(clientX) {
    const svg = svgRef.current;
    if (!svg) return x;

    // Convert client coords to SVG coords
    const pt = new DOMPoint(clientX, 0);
    const ctm = svg.getScreenCTM();
    if (!ctm) return x;

    const svgPt = pt.matrixTransform(ctm.inverse());
    return svgPt.x;
  }

  function setFromClientX(clientX) {
    const raw = clientXToSvgX(clientX);
    const next = clamp(raw, xMin, xMax);
    setX(next);
  }

  function onPointerDown(e) {
    // Alleen starten met primary button/touch
    if (e.button != null && e.button !== 0) return;

    activePointerId.current = e.pointerId;
    setDragging(true);

    // Zodat je ook buiten het bolletje kunt blijven slepen
    e.currentTarget.setPointerCapture(e.pointerId);

    setFromClientX(e.clientX);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    if (activePointerId.current !== e.pointerId) return;
    setFromClientX(e.clientX);
  }

  function endDrag(e) {
    if (activePointerId.current !== e.pointerId) return;
    activePointerId.current = null;
    setDragging(false);
  }

  // Optioneel: “snap” naar dichtstbijzijnde diamond als je loslaat
  function snapToNearest() {
    let best = diamonds[0];
    let bestDist = Math.abs(x - best);
    for (const d of diamonds) {
      const dist = Math.abs(x - d);
      if (dist < bestDist) {
        bestDist = dist;
        best = d;
      }
    }
    setX(best);
  }

  return (
    <div className="flex justify-center mt-8 select-none">
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        // Je kunt ook op de hele svg klikken om te verplaatsen
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => {
          endDrag(e);
          // snapToNearest(); // <- zet aan als je snapping wilt
        }}
        onPointerCancel={endDrag}
        style={{ touchAction: "none", cursor: dragging ? "grabbing" : "grab" }}
      >
        {/* Basis lijn */}
        <line
          x1={xMin}
          y1={yLine}
          x2={xMax}
          y2={yLine}
          stroke="var(--muted)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Diamonds op de lijn */}
        {diamonds.map((dx, i) => (
          <rect
            key={i}
            x={dx - 4}
            y={yLine - 4}
            width="8"
            height="8"
            fill="var(--accent)"
            transform={`rotate(45 ${dx} ${yLine})`}
            opacity={0.9}
          />
        ))}

        {/* Draggable bolletje (handle) */}
        <circle
          cx={x}
          cy={yLine}
          r="9"
          fill="var(--accent)"
          stroke="var(--text)"
          strokeWidth="2"
        />

        {/* Optioneel: ring/glow als je aan het slepen bent */}
        {dragging && (
          <circle
            cx={x}
            cy={yLine}
            r="14"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            opacity="0.5"
          />
        )}

        {/* Optioneel: progress gedeelte van de lijn */}
        <line
          x1={xMin}
          y1={yLine}
          x2={x}
          y2={yLine}
          stroke="var(--accent)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
