"use client";
import React, { useMemo, useRef, useState } from "react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function diamondPath(cx, cy, r) {
  // returns points for a diamond (rotated square)
  return `${cx} ${cy - r} ${cx + r} ${cy} ${cx} ${cy + r} ${cx - r} ${cy}`;
}

export default function UnityAnimationEditor() {
  // --- Timeline settings ---
  const duration = 1.0; // seconds (Unity-like small clip)
  const basePxPerSec = 700; // at zoom=1
  const rowH = 38;
  const headerH = 44;
  const leftPanelW = 260;

  // --- Zoom / scroll ---
  const [zoom, setZoom] = useState(1.0); // 0.5 .. 2.5
  const pxPerSec = basePxPerSec * zoom;

  // playhead time
  const [time, setTime] = useState(0.0);

  // selection
  const [selectedTrackId, setSelectedTrackId] = useState("scale");

  // dragging state
  const [drag, setDrag] = useState(null);
  // drag = { type: "playhead" } OR { type:"key", trackId, keyId, startClientX, startTime }

  // refs
  const timelineRef = useRef(null);

  // --- Tracks data ---
  const [tracks, setTracks] = useState(() => [
    {
      id: "scale",
      group: "Transform",
      name: "Scale",
      keys: [
        { id: "k1", t: 0.0 },
        { id: "k2", t: 0.85 },
      ],
    },
    {
      id: "pos",
      group: "Transform",
      name: "Position",
      keys: [{ id: "k1", t: 0.25 }],
    },
    {
      id: "rot",
      group: "Transform",
      name: "Rotation",
      keys: [{ id: "k1", t: 0.6 }],
    },
    {
      id: "mat",
      group: "Renderer",
      name: "Material Color",
      keys: [{ id: "k1", t: 0.12 }, { id: "k2", t: 0.72 }],
    },
  ]);

  const grouped = useMemo(() => {
    const m = new Map();
    for (const tr of tracks) {
      if (!m.has(tr.group)) m.set(tr.group, []);
      m.get(tr.group).push(tr);
    }
    return Array.from(m.entries());
  }, [tracks]);

  const totalRows = tracks.length;
  const timelineW = Math.max(900, duration * pxPerSec + 120);

  // grid: major every 0.1s, minor every 0.02s (Unity-ish)
  const majorStep = 0.1;
  const minorStep = 0.02;

  function timeToX(t) {
    return t * pxPerSec;
  }
  function xToTime(x) {
    return x / pxPerSec;
  }

  function getLocalX(clientX) {
    const el = timelineRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    // include scrollLeft
    return clientX - rect.left + el.scrollLeft;
  }

  function setPlayheadFromClientX(clientX) {
    const lx = getLocalX(clientX);
    const t = clamp(xToTime(lx), 0, duration);
    setTime(t);
  }

  function onPointerDownTimeline(e) {
    // clicking in empty timeline moves playhead
    if (e.button != null && e.button !== 0) return;
    setDrag({ type: "playhead" });
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlayheadFromClientX(e.clientX);
  }

  function onPointerMoveTimeline(e) {
    if (!drag) return;
    if (drag.type === "playhead") {
      setPlayheadFromClientX(e.clientX);
    } else if (drag.type === "key") {
      const lx = getLocalX(e.clientX);
      const t = clamp(xToTime(lx), 0, duration);

      setTracks((prev) =>
        prev.map((tr) => {
          if (tr.id !== drag.trackId) return tr;
          return {
            ...tr,
            keys: tr.keys.map((k) =>
              k.id === drag.keyId ? { ...k, t } : k
            ),
          };
        })
      );
    }
  }

  function onPointerUpTimeline(e) {
    if (!drag) return;
    setDrag(null);
  }

  function onPointerDownKey(e, trackId, keyId) {
    e.stopPropagation(); // don’t move playhead
    if (e.button != null && e.button !== 0) return;
    setSelectedTrackId(trackId);
    setDrag({ type: "key", trackId, keyId });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function addKeyAt(trackId, clientX) {
    const lx = getLocalX(clientX);
    const t = clamp(xToTime(lx), 0, duration);
    setTracks((prev) =>
      prev.map((tr) => {
        if (tr.id !== trackId) return tr;
        const newId = `k${Math.random().toString(16).slice(2)}`;
        return { ...tr, keys: [...tr.keys, { id: newId, t }].sort((a, b) => a.t - b.t) };
      })
    );
  }

  function onDoubleClickRow(trackId, e) {
    addKeyAt(trackId, e.clientX);
  }

  // Build grid lines positions
  const minorLines = [];
  for (let t = 0; t <= duration + 1e-9; t += minorStep) {
    minorLines.push(t);
  }
  const majorLines = [];
  for (let t = 0; t <= duration + 1e-9; t += majorStep) {
    majorLines.push(t);
  }

  return (
    <div className="w-full rounded-2xl border border-(--muted) bg-black/20 overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-(--muted) bg-black/30">
        <div className="flex items-center gap-3">
          <div className="text-sm text-(--text) font-semibold">Animation</div>
          <div className="text-xs text-(--muted)">Clip: Ball_Pulse</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-(--muted)">Zoom</div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-40"
          />
          <div className="text-xs text-(--muted) tabular-nums w-12 text-right">
            {zoom.toFixed(2)}x
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="flex w-full">
        {/* LEFT: property list */}
        <div
          className="shrink-0 border-r border-(--muted) bg-black/25"
          style={{ width: leftPanelW }}
        >
          <div
            className="flex items-center justify-between px-3"
            style={{ height: headerH }}
          >
            <div className="text-xs text-(--muted)">Properties</div>
            <button
              className="text-xs text-(--accent) hover:opacity-80"
              onClick={() => {
                // quick add demo track
                setTracks((prev) => [
                  ...prev,
                  {
                    id: `custom_${prev.length}`,
                    group: "Custom",
                    name: `Track ${prev.length + 1}`,
                    keys: [{ id: "k1", t: 0.1 }],
                  },
                ]);
              }}
            >
              + Add
            </button>
          </div>

          <div className="pb-3">
            {grouped.map(([group, trs]) => (
              <div key={group} className="mb-2">
                <div className="px-3 py-1 text-xs text-(--muted) uppercase tracking-wide">
                  {group}
                </div>

                {trs.map((tr) => {
                  const selected = tr.id === selectedTrackId;
                  return (
                    <button
                      key={tr.id}
                      onClick={() => setSelectedTrackId(tr.id)}
                      className={[
                        "w-full text-left px-3 flex items-center justify-between",
                        "hover:bg-white/5",
                        selected ? "bg-white/10" : "",
                      ].join(" ")}
                      style={{ height: rowH }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "inline-block h-2 w-2 rounded-full",
                            selected ? "bg-(--accent)" : "bg-(--muted)",
                          ].join(" ")}
                        />
                        <span className="text-sm text-(--text)">{tr.name}</span>
                      </div>
                      <span className="text-xs text-(--muted) tabular-nums">
                        {tr.keys.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: timeline */}
        <div className="flex-1 min-w-0">
          {/* Timeline header: ruler */}
          <div
            className="relative border-b border-(--muted) bg-black/20"
            style={{ height: headerH }}
          >
            <div
              ref={timelineRef}
              className="h-full overflow-x-auto overflow-y-hidden"
              onPointerDown={onPointerDownTimeline}
              onPointerMove={onPointerMoveTimeline}
              onPointerUp={onPointerUpTimeline}
              onPointerCancel={onPointerUpTimeline}
              style={{ touchAction: "none" }}
            >
              <div className="relative" style={{ width: timelineW, height: headerH }}>
                {/* ruler ticks */}
                {majorLines.map((t) => {
                  const x = timeToX(t);
                  return (
                    <div
                      key={`maj_${t}`}
                      className="absolute top-0 h-full border-l border-white/15"
                      style={{ left: x }}
                    >
                      <div className="absolute top-1 left-1 text-[10px] text-(--muted) tabular-nums">
                        {t.toFixed(1)}s
                      </div>
                      <div className="absolute bottom-0 left-0 w-px h-3 bg-white/25" />
                    </div>
                  );
                })}

                {/* playhead */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-(--accent)"
                  style={{ left: timeToX(time) }}
                >
                  <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 rotate-45 bg-(--accent)" />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline body: tracks */}
          <div className="relative">
            <div
              ref={timelineRef}
              className="overflow-x-auto overflow-y-auto"
              style={{ maxHeight: 420, touchAction: "none" }}
              onPointerMove={onPointerMoveTimeline}
              onPointerUp={onPointerUpTimeline}
              onPointerCancel={onPointerUpTimeline}
              onPointerDown={onPointerDownTimeline}
            >
              <div
                className="relative"
                style={{ width: timelineW, height: totalRows * rowH }}
              >
                {/* vertical grid lines */}
                {minorLines.map((t) => {
                  const x = timeToX(t);
                  const isMajor = Math.abs((t / majorStep) - Math.round(t / majorStep)) < 1e-6;
                  return (
                    <div
                      key={`grid_${t}`}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: x,
                        width: 1,
                        background: isMajor ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                      }}
                      aria-hidden
                    />
                  );
                })}

                {/* row backgrounds + keyframes */}
                {tracks.map((tr, idx) => {
                  const yTop = idx * rowH;
                  const selected = tr.id === selectedTrackId;

                  return (
                    <div
                      key={tr.id}
                      className={[
                        "absolute left-0 right-0",
                        selected ? "bg-white/5" : idx % 2 === 0 ? "bg-white/0" : "bg-white/2",
                      ].join(" ")}
                      style={{ top: yTop, height: rowH }}
                      onDoubleClick={(e) => onDoubleClickRow(tr.id, e)}
                    >
                      {/* horizontal separator */}
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

                      {/* keys */}
                      <svg
                        className="absolute inset-0"
                        width="100%"
                        height={rowH}
                        viewBox={`0 0 ${timelineW} ${rowH}`}
                      >
                        {tr.keys.map((k) => {
                          const x = timeToX(k.t);
                          const cy = rowH / 2;
                          const r = 7;

                          const isActive = drag?.type === "key" && drag.trackId === tr.id && drag.keyId === k.id;

                          return (
                            <g
                              key={k.id}
                              onPointerDown={(e) => onPointerDownKey(e, tr.id, k.id)}
                              onPointerMove={onPointerMoveTimeline}
                              onPointerUp={onPointerUpTimeline}
                              onPointerCancel={onPointerUpTimeline}
                              style={{ cursor: "grab" }}
                            >
                              {/* hit area */}
                              <circle cx={x} cy={cy} r={16} fill="transparent" />
                              {/* diamond */}
                              <polygon
                                points={diamondPath(x, cy, r)}
                                fill={isActive || selected ? "var(--accent)" : "rgba(255,255,255,0.25)"}
                                stroke="rgba(0,0,0,0.35)"
                                strokeWidth="1"
                              />
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })}

                {/* playhead in body */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-(--accent)"
                  style={{ left: timeToX(time) }}
                  aria-hidden
                />
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-3 py-2 text-xs text-(--muted) border-t border-(--muted) bg-black/15">
              Tip: sleep keyframes (diamonds), klik om playhead te verplaatsen, dubbelklik op een track om een keyframe toe te voegen.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
