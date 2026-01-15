"use client";
import React, { useMemo, useRef, useState } from "react";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function shortestAngleLerp(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

function timeToX(t, pxPerSec) {
  return t * pxPerSec;
}
function xToTime(x, pxPerSec) {
  return x / pxPerSec;
}

function diamondPoints(cx, cy, r) {
  return `${cx} ${cy - r} ${cx + r} ${cy} ${cx} ${cy + r} ${cx - r} ${cy}`;
}

function evalKeys(keys, t) {
  if (!keys || keys.length === 0) return null;
  const sorted = [...keys].sort((a, b) => a.t - b.t);
  if (t <= sorted[0].t) return sorted[0].v;
  if (t >= sorted[sorted.length - 1].t) return sorted[sorted.length - 1].v;

  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (t >= a.t && t <= b.t) {
      const u = (t - a.t) / (b.t - a.t);
      return shortestAngleLerp(a.v, b.v, u);
    }
  }
  return sorted[0].v;
}

const ALL_LIMBS = [
  { id: "armL", label: "Left Arm" },
  { id: "armR", label: "Right Arm" },
  { id: "legL", label: "Left Leg" },
  { id: "legR", label: "Right Leg" },
];

export default function WorkingAnimationLine() {
  // Timeline basics
  const duration = 1.0;
  const basePxPerSec = 700;
  const [zoom, setZoom] = useState(1.2);
  const pxPerSec = basePxPerSec * zoom;

  const leftPanelW = 260;
  const charPanelW = 320;

  const headerH = 44;
  const rowH = 38;

  // IMPORTANT: one ref for the ONE horizontal scroll container
  const timelineRef = useRef(null);

  const [time, setTime] = useState(0.0);
  const [drag, setDrag] = useState(null); // {type:"playhead"} | {type:"key",trackId,keyId} | {type:"limb",limbId}

  const [tracks, setTracks] = useState(() => [
    {
      id: "armL",
      name: "Left Arm",
      keys: [
        { id: "k1", t: 0.0, v: -0.6 },
        { id: "k2", t: 0.8, v: 0.7 },
      ],
    },
  ]);

  const trackIds = useMemo(() => new Set(tracks.map((t) => t.id)), [tracks]);
  const [selectedTrackId, setSelectedTrackId] = useState("armL");
  const [showAdd, setShowAdd] = useState(false);

  const [pose, setPose] = useState(() => ({
    armL: -0.6,
    armR: 0.6,
    legL: 0.25,
    legR: -0.25,
  }));

  const animatedPose = useMemo(() => {
    const next = { ...pose };
    for (const tr of tracks) {
      const v = evalKeys(tr.keys, time);
      if (v != null) next[tr.id] = v;
    }
    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, tracks]);

  function setLimbAngle(limbId, angle) {
    setPose((p) => ({ ...p, [limbId]: angle }));
  }

  // Convert clientX -> local timeline X (includes scrollLeft)
  function getLocalX(clientX) {
    const el = timelineRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clientX - rect.left + el.scrollLeft;
  }

  function setPlayheadFromClientX(clientX) {
    const x = getLocalX(clientX);
    setTime(clamp(xToTime(x, pxPerSec), 0, duration));
  }

  function onPointerDownTimeline(e) {
    if (e.button != null && e.button !== 0) return;
    setDrag({ type: "playhead" });
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlayheadFromClientX(e.clientX);
  }

  function onPointerMoveTimeline(e) {
    if (!drag) return;

    if (drag.type === "playhead") {
      setPlayheadFromClientX(e.clientX);
      return;
    }

    if (drag.type === "key") {
      const lx = getLocalX(e.clientX);
      const t = clamp(xToTime(lx, pxPerSec), 0, duration);

      setTracks((prev) =>
        prev.map((tr) => {
          if (tr.id !== drag.trackId) return tr;
          return {
            ...tr,
            keys: tr.keys.map((k) => (k.id === drag.keyId ? { ...k, t } : k)),
          };
        })
      );
    }
  }

  function endDrag() {
    setDrag(null);
  }

  function onPointerDownKey(e, trackId, keyId) {
    e.stopPropagation();
    if (e.button != null && e.button !== 0) return;
    setSelectedTrackId(trackId);
    setDrag({ type: "key", trackId, keyId });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function addTrack(limbId) {
    const meta = ALL_LIMBS.find((l) => l.id === limbId);
    if (!meta) return;

    setTracks((prev) => [
      ...prev,
      {
        id: limbId,
        name: meta.label,
        keys: [],
      },
    ]);
    setSelectedTrackId(limbId);
    setShowAdd(false);
  }

  function addKeyframe(trackId) {
    const currentAngle = pose[trackId];
    if (currentAngle == null) return;

    setTracks((prev) =>
      prev.map((tr) => {
        if (tr.id !== trackId) return tr;
        const existing = tr.keys.find((k) => Math.abs(k.t - time) < 1e-3);

        if (existing) {
          return {
            ...tr,
            keys: tr.keys.map((k) =>
              k.id === existing.id ? { ...k, v: currentAngle } : k
            ),
          };
        }

        const id = `k${Math.random().toString(16).slice(2)}`;
        const keys = [...tr.keys, { id, t: time, v: currentAngle }].sort(
          (a, b) => a.t - b.t
        );
        return { ...tr, keys };
      })
    );
  }

  function onKeyDown(e) {
    if (e.key.toLowerCase() === "k") {
      if (selectedTrackId) addKeyframe(selectedTrackId);
    }
  }

  // Grid
  const majorStep = 0.1;
  const minorStep = 0.02;

  const majorLines = useMemo(() => {
    const arr = [];
    for (let t = 0; t <= duration + 1e-9; t += majorStep) {
      arr.push(Number(t.toFixed(4)));
    }
    return arr;
  }, [duration]);

  const minorLines = useMemo(() => {
    const arr = [];
    for (let t = 0; t <= duration + 1e-9; t += minorStep) {
      arr.push(Number(t.toFixed(4)));
    }
    return arr;
  }, [duration]);

  const timelineW = Math.max(900, duration * pxPerSec + 120);
  const rows = tracks.length;

  // Character layout
  const charH = 380;
  const torso = { x: 150, y: 150, w: 60, h: 90 };
  const head = { x: 150, y: 95, r: 24 };

  const pivots = {
    armL: { x: torso.x - torso.w / 2, y: torso.y - 25 },
    armR: { x: torso.x + torso.w / 2, y: torso.y - 25 },
    legL: { x: torso.x - 15, y: torso.y + torso.h / 2 },
    legR: { x: torso.x + 15, y: torso.y + torso.h / 2 },
  };

  const limbLen = {
    armL: 70,
    armR: 70,
    legL: 85,
    legR: 85,
  };

  function limbEnd(limbId, angle) {
    const p = pivots[limbId];
    const L = limbLen[limbId];
    return { x: p.x + Math.cos(angle) * L, y: p.y + Math.sin(angle) * L };
  }

  const charRef = useRef(null);

  function clientToCharXY(clientX, clientY) {
    const el = charRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function onPointerDownLimb(e, limbId) {
    if (e.button != null && e.button !== 0) return;
    setSelectedTrackId(limbId);
    setDrag({ type: "limb", limbId });
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMoveLimb(e) {
    if (!drag || drag.type !== "limb") return;
    const { limbId } = drag;
    const p = pivots[limbId];
    const pt = clientToCharXY(e.clientX, e.clientY);
    const ang = Math.atan2(pt.y - p.y, pt.x - p.x);
    setLimbAngle(limbId, ang);
  }

  function onPointerUpLimb() {
    if (drag?.type === "limb") setDrag(null);
  }

  const renderPose = drag?.type === "limb" ? pose : animatedPose;
  const addableLimbs = ALL_LIMBS.filter((l) => !trackIds.has(l.id));

  return (
    <div
      className="w-full rounded-2xl border border-(--muted) bg-black/20 overflow-hidden"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 h-11 border-b border-(--muted) bg-black/30">
        <div className="flex items-center gap-3">
          <div className="text-sm text-(--text) font-semibold">Animation</div>
          <div className="text-xs text-(--muted)">Mini Rig Editor</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="text-xs px-3 py-1 rounded-lg border border-(--muted) text-(--text) hover:bg-white/5"
            onClick={() => selectedTrackId && addKeyframe(selectedTrackId)}
            title="Keyframe (K)"
          >
            Keyframe (K)
          </button>

          <div className="text-xs text-(--muted)">Zoom</div>
          <input
            type="range"
            min="0.6"
            max="2.6"
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

      {/* Main: 3 columns */}
      <div className="flex w-full">
        {/* LEFT: Tracks */}
        <div
          className="shrink-0 border-r border-(--muted) bg-black/25"
          style={{ width: leftPanelW }}
        >
          <div className="flex items-center justify-between px-3" style={{ height: 44 }}>
            <div className="text-xs text-(--muted)">Tracks</div>

            <div className="relative">
              <button
                className="text-xs text-(--accent) hover:opacity-80"
                onClick={() => setShowAdd((s) => !s)}
              >
                + Add
              </button>

              {showAdd && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-(--muted) bg-black/80 backdrop-blur p-2 z-20">
                  <div className="text-[11px] text-(--muted) px-2 py-1">
                    Add limb track
                  </div>
                  {addableLimbs.length === 0 && (
                    <div className="text-xs text-(--muted) px-2 py-2">
                      All limbs added
                    </div>
                  )}
                  {addableLimbs.map((l) => (
                    <button
                      key={l.id}
                      className="w-full text-left px-2 py-2 rounded-lg text-sm text-(--text) hover:bg-white/10"
                      onClick={() => addTrack(l.id)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pb-3">
            {tracks.map((tr) => {
              const selected = tr.id === selectedTrackId;
              return (
                <button
                  key={tr.id}
                  onClick={() => setSelectedTrackId(tr.id)}
                  className={[
                    "w-full text-left px-3 flex items-center justify-between hover:bg-white/5",
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

          <div className="px-3 pb-3 text-xs text-(--muted)">
            Drag limbs → pose. <br />
            Scrub timeline → playback. <br />
            Press <span className="text-(--text)">K</span> to keyframe selected track.
          </div>
        </div>

        {/* MIDDLE: Timeline (ONE horizontal scroller) */}
        <div className="flex-1 min-w-0 border-r border-(--muted)">
          <div
            ref={timelineRef}
            className="relative overflow-x-auto"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDownTimeline}
            onPointerMove={onPointerMoveTimeline}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div className="relative" style={{ width: timelineW }}>
              {/* Sticky ruler */}
              <div
                className="sticky top-0 z-20 border-b border-(--muted) bg-black/30"
                style={{ height: headerH }}
              >
                <div className="relative" style={{ width: timelineW, height: headerH }}>
                  {majorLines.map((t) => {
                    const x = timeToX(t, pxPerSec);
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

                  {/* Playhead in ruler */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-(--accent)"
                    style={{ left: timeToX(time, pxPerSec) }}
                  >
                    <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 rotate-45 bg-(--accent)" />
                  </div>
                </div>
              </div>

              {/* Vertical scroll area for rows (shares same horizontal scroll) */}
              <div className="relative overflow-y-auto" style={{ maxHeight: 420 }}>
                <div className="relative" style={{ width: timelineW, height: rows * rowH }}>
                  {/* Grid */}
                  {minorLines.map((t) => {
                    const x = timeToX(t, pxPerSec);
                    const isMajor =
                      Math.abs(t / majorStep - Math.round(t / majorStep)) < 1e-6;

                    return (
                      <div
                        key={`grid_${t}`}
                        className="absolute top-0 bottom-0"
                        style={{
                          left: x,
                          width: 1,
                          background: isMajor
                            ? "rgba(255,255,255,0.12)"
                            : "rgba(255,255,255,0.06)",
                        }}
                        aria-hidden
                      />
                    );
                  })}

                  {tracks.map((tr, idx) => {
                    const yTop = idx * rowH;
                    const selected = tr.id === selectedTrackId;

                    return (
                      <div
                        key={tr.id}
                        className={[
                          "absolute left-0 right-0",
                          selected
                            ? "bg-white/5"
                            : idx % 2 === 0
                            ? "bg-white/0"
                            : "bg-white/[0.02]",
                        ].join(" ")}
                        style={{ top: yTop, height: rowH }}
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

                        <svg
                          className="absolute inset-0"
                          width="100%"
                          height={rowH}
                          viewBox={`0 0 ${timelineW} ${rowH}`}
                        >
                          {tr.keys.map((k) => {
                            const x = timeToX(k.t, pxPerSec);
                            const cy = rowH / 2;
                            const r = 7;
                            const isActive =
                              drag?.type === "key" &&
                              drag.trackId === tr.id &&
                              drag.keyId === k.id;

                            return (
                              <g
                                key={k.id}
                                onPointerDown={(e) => onPointerDownKey(e, tr.id, k.id)}
                                style={{ cursor: "grab" }}
                              >
                                <circle cx={x} cy={cy} r={16} fill="transparent" />
                                <polygon
                                  points={diamondPoints(x, cy, r)}
                                  fill={
                                    isActive || selected
                                      ? "var(--accent)"
                                      : "rgba(255,255,255,0.25)"
                                  }
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

                  {/* Playhead across rows */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-(--accent)"
                    style={{ left: timeToX(time, pxPerSec) }}
                    aria-hidden
                  />
                </div>
              </div>

              <div className="px-3 py-2 text-xs text-(--muted) border-t border-(--muted) bg-black/15">
                Eén timeline: ruler + keyframes zitten vast aan elkaar (Unity-style).
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Character */}
        <div className="shrink-0 bg-black/20" style={{ width: charPanelW }}>
          <div className="px-3 flex items-center justify-between" style={{ height: 44 }}>
            <div className="text-xs text-(--muted)">Character</div>
            <div className="text-xs text-(--muted) tabular-nums">
              t={time.toFixed(3)}s
            </div>
          </div>

          <div className="px-3 pb-3">
            <div
              ref={charRef}
              className="relative rounded-2xl border border-(--muted) bg-black/30 overflow-hidden"
              style={{ width: "100%", height: charH }}
              onPointerMove={onPointerMoveLimb}
              onPointerUp={onPointerUpLimb}
              onPointerCancel={onPointerUpLimb}
            >
              {/* Head */}
              <div
                className="absolute rounded-full border border-white/15 bg-white/10"
                style={{
                  left: head.x - head.r,
                  top: head.y - head.r,
                  width: head.r * 2,
                  height: head.r * 2,
                }}
              />

              {/* Torso */}
              <div
                className="absolute rounded-2xl border border-white/15 bg-white/10"
                style={{
                  left: torso.x - torso.w / 2,
                  top: torso.y - torso.h / 2,
                  width: torso.w,
                  height: torso.h,
                }}
              />

              {/* Limbs */}
              {ALL_LIMBS.map((l) => {
                const id = l.id;
                const p = pivots[id];
                const ang = renderPose[id];
                const end = limbEnd(id, ang);

                const selected = selectedTrackId === id;
                const trackExists = trackIds.has(id);

                return (
                  <React.Fragment key={id}>
                    <div
                      className="absolute"
                      style={{
                        left: p.x,
                        top: p.y,
                        width: limbLen[id],
                        height: 6,
                        transformOrigin: "0px 50%",
                        transform: `rotate(${ang}rad)`,
                        background: trackExists ? "var(--accent)" : "rgba(255,255,255,0.25)",
                        borderRadius: 9999,
                        opacity: selected ? 1 : 0.75,
                      }}
                    />

                    <div
                      className="absolute rounded-full border border-black/40"
                      style={{
                        left: p.x - 6,
                        top: p.y - 6,
                        width: 12,
                        height: 12,
                        background: selected ? "var(--accent)" : "rgba(255,255,255,0.35)",
                      }}
                      title={`${l.label} pivot`}
                    />

                    <div
                      className="absolute rounded-full"
                      onPointerDown={(e) => onPointerDownLimb(e, id)}
                      style={{
                        left: end.x - 10,
                        top: end.y - 10,
                        width: 20,
                        height: 20,
                        background: selected ? "var(--accent)" : "rgba(255,255,255,0.2)",
                        border: selected
                          ? "2px solid var(--text)"
                          : "1px solid rgba(255,255,255,0.15)",
                        cursor: "grab",
                      }}
                      title={`Drag ${l.label}`}
                    />
                  </React.Fragment>
                );
              })}

              <div className="absolute left-3 bottom-3 text-xs text-(--muted)">
                Drag the round handles to rotate limbs.
              </div>
            </div>

            <div className="mt-3 text-xs text-(--muted)">
              Selected: <span className="text-(--text)">{selectedTrackId}</span>{" "}
              {trackIds.has(selectedTrackId) ? "" : "(add a track to animate)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
