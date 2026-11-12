import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './CircularCarousel.css';

const photo = (id) => `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=max`;

const DEFAULT_ITEMS = [
  {
    src: photo('photo-1583743814966-8936f5b7be1a'),
    alt: 'CALEM Club Signature Boxy Tee',
    title: 'Signature Boxy Tee',
    subtitle: '260GSM Heavy Cotton',
  },
  {
    src: photo('photo-1556821840-3a63f95609a7'),
    alt: 'Acid Washed Heavyweight Zip Hoodie',
    title: 'Acid Wash Hoodie',
    subtitle: '420GSM Terry Fleece',
  },
  {
    src: photo('photo-1624378439575-d8705ad7ae80'),
    alt: 'Parachute Baggy Cargo Pants',
    title: 'Parachute Cargo',
    subtitle: 'Nylon Ripstop',
  },
  {
    src: photo('photo-1551028719-00167b16eac5'),
    alt: 'CALEM Racing Varsity Bomber Jacket',
    title: 'Varsity Bomber',
    subtitle: 'Chenille & PU Leather',
  },
  {
    src: photo('photo-1503342217505-b0a15ec3261c'),
    alt: 'Studio Ribbed Cropped Baby Tee',
    title: 'Cropped Baby Tee',
    subtitle: '4-Way Ribbed Cotton',
  },
  {
    src: photo('photo-1596755094514-f87e34085b2c'),
    alt: 'Corduroy Relaxed Overshirt',
    title: 'Corduroy Overshirt',
    subtitle: 'Relaxed Fit',
  },
  {
    src: photo('photo-1583496661160-fb5886a0aaaa'),
    alt: 'Pleated Streetwear Mini Skirt',
    title: 'Pleated Mini Skirt',
    subtitle: 'Streetwear Archive',
  },
  {
    src: photo('photo-1597484661643-2f5fef640dd1'),
    alt: 'Heavy Canvas Utility Tote Bag',
    title: 'Utility Tote Bag',
    subtitle: '16oz Heavy Canvas',
  },
];

const PRESETS = {
  cylinder: {
    axis: 'y',
    tilt: -5,
    perspective: 2500,
    curve: 1,
    spread: 1,
    inward: false,
    billboard: false,
    backfaces: true,
    window: 0,
  },
  orbit: {
    axis: 'y',
    tilt: -16,
    perspective: 1500,
    curve: 0,
    spread: 1.45,
    inward: false,
    billboard: true,
    backfaces: false,
    window: 0,
  },
  wheel: {
    axis: 'x',
    tilt: 0,
    perspective: 1800,
    curve: 0,
    spread: 1,
    inward: false,
    billboard: false,
    backfaces: true,
    window: 1.7,
  },
  panorama: {
    axis: 'y',
    tilt: 0,
    perspective: 0,
    curve: 1,
    spread: 1,
    inward: true,
    billboard: false,
    backfaces: false,
    window: 0,
  },
};

const INTRO_LENGTH = { assemble: 1500, rise: 1400, spin: 1800, none: 0 };
const TILES = 8;
const OVERLAP = 2.5;
const DRAG_THRESHOLD = 5;
const SPRING = 118;
const SETTLE_SPEED = 9;
const CAPTION_SPACE = 76;
const SWAP_LENGTH = 700;
const SWAP_SPREAD = 420;
const TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = (degrees) => ((((degrees + 180) % 360) + 360) % 360) - 180;
const easeOut = (t) => 1 - Math.pow(1 - t, 4);
const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

const rotateX = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};

const rotateY = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const Digits = ({ value }) => (
  <span className="circular-carousel__digits">
    {String(value)
      .padStart(2, '0')
      .split('')
      .map((digit, index) => (
        <span key={index} className="circular-carousel__digit">
          <span
            className="circular-carousel__reel"
            style={{ transform: `translateY(${-Number(digit) * 10}%)` }}
          >
            {'0123456789'.split('').map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
  </span>
);

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

const CircularCarousel = ({
  items = DEFAULT_ITEMS,
  preset = 'cylinder',
  intro = 'rise',
  cardWidth = 220,
  aspectRatio = 1,
  gap = 25,
  curve,
  tilt,
  perspective,
  autoplay = 'drift',
  speed = 14,
  interval = 3,
  direction = 'left',
  draggable = true,
  momentum = 0.6,
  snap = true,
  pauseOnHover = true,
  focusOnClick = true,
  parallax = 0.3,
  stretch = 0.5,
  depthFade = 0.55,
  fadeColor = '#000000',
  innerShade = 0.6,
  cornerRadius = 12,
  captions = false,
  onChange,
  onItemClick,
  className = '',
  style,
}) => {
  const incoming = items && items.length ? items : DEFAULT_ITEMS;
  const [list, setList] = useState(incoming);
  const [leaving, setLeaving] = useState(null);
  const count = list.length;
  const shape = PRESETS[preset] ? preset : 'cylinder';
  const layout = PRESETS[shape];
  const axis = layout.axis;
  const tiltValue = tilt ?? layout.tilt;
  const curveValue = layout.billboard ? 0 : clamp(curve ?? layout.curve, 0, 1);
  const reduced = usePrefersReducedMotion();

  const cardW = Math.max(40, cardWidth);
  const cardH = cardW / clamp(aspectRatio, 0.2, 5);
  const along = axis === 'x' ? cardH : cardW;
  const step = 360 / Math.max(count, 1);

  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = (along + gap) * layout.spread;
    const chord = pitch / (2 * Math.sin(Math.PI / n));
    const arc = (n * pitch) / (2 * Math.PI);
    return Math.max(chord + (arc - chord) * curveValue, along * 0.6);
  }, [count, along, gap, curveValue, layout.spread]);

  const tiles = useMemo(() => {
    const total = curveValue > 0.001 ? TILES : 1;
    const length = along / total;
    const bend = curveValue > 0.001 ? radius / curveValue : 0;
    return Array.from({ length: total }, (_, index) => {
      const start = index * length - (index > 0 ? OVERLAP / 2 : 0);
      const end = (index + 1) * length + (index < total - 1 ? OVERLAP / 2 : 0);
      const center = (start + end) / 2 - along / 2;
      const alpha = bend ? center / bend : 0;
      const shift = bend ? bend * Math.sin(alpha) : center;
      const sink = bend ? bend * (1 - Math.cos(alpha)) : 0;
      const depth = layout.inward ? sink : -sink;
      const turn = ((layout.inward ? -alpha : alpha) * 180) / Math.PI;
      const move =
        axis === 'x'
          ? `translate3d(0px, ${shift}px, ${depth}px) rotateX(${-turn}deg)`
          : `translate3d(${shift}px, 0px, ${depth}px) rotateY(${turn}deg)`;
      return { index, total, start, end, size: end - start, move };
    });
  }, [along, axis, curveValue, layout.inward, radius]);

  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(() => {});
  const measureRef = useRef(() => {});
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const readyRef = useRef(false);
  readyRef.current = ready;

  const stateRef = useRef({
    angle: 0,
    velocity: 0,
    target: null,
    dir: 0,
    press: null,
    drag: false,
    hover: false,
    pointer: { inside: false, x: 0, y: 0 },
    yaw: 0,
    pitch: 0,
    intro: null,
    introDone: false,
    holdUntil: 0,
    stepAt: 0,
    suppressClick: false,
    wheelTimer: 0,
    fit: 1,
    shift: 0,
    drop: 0,
    last: 0,
  });

  const settings = {
    count,
    step,
    radius,
    layout,
    axis,
    tilt: tiltValue,
    perspective: layout.inward ? radius : (perspective ?? layout.perspective),
    cardW,
    cardH,
    intro: reduced ? 'none' : intro in INTRO_LENGTH ? intro : 'rise',
    autoplay: reduced ? 'off' : autoplay,
    speed,
    interval: Math.max(0.5, interval),
    draggable,
    momentum: clamp(momentum, 0, 1),
    snap,
    pauseOnHover,
    parallax: reduced ? 0 : clamp(parallax, 0, 1),
    stretch: reduced ? 0 : clamp(stretch, 0, 1),
    depthFade: clamp(depthFade, 0, 1),
    captions,
    reduced,
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const dragSign = layout.inward ? -1 : 1;
  const directionSign = (direction === 'right' ? 1 : -1) * dragSign;

  useEffect(() => {
    stateRef.current.dir = directionSign;
    wakeRef.current();
  }, [directionSign, preset, tilt, curve, perspective, autoplay, speed]);

  const incomingRef = useRef(incoming);
  incomingRef.current = incoming;
  const listRef = useRef(list);
  listRef.current = list;
  const sourcesKey = incoming.map((item) => item.src).join('|');

  useEffect(() => {
    let cancelled = false;
    const next = incomingRef.current;
    const smooth = readyRef.current && next.length === listRef.current.length;
    if (!smooth) {
      setReady(false);
      setLeaving(null);
      setList(next);
    }
    const sources = next.slice(0, 16).map((item) => item.src);
    const load = (src) =>
      new Promise((resolve) => {
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => (image.decode ? image.decode().then(resolve, resolve) : resolve());
        image.onerror = resolve;
        image.src = src;
      });
    const timeout = new Promise((resolve) => setTimeout(resolve, 2400));
    Promise.race([Promise.all(sources.map(load)), timeout]).then(() => {
      if (cancelled) return;
      const state = stateRef.current;
      if (smooth) {
        const previous = listRef.current;
        const s = settingsRef.current;
        if (!s.reduced && previous !== next) {
          setLeaving({ items: previous, at: performance.now() });
        }
        setList(next);
      } else {
        state.intro = performance.now();
        state.introDone = false;
        state.stepAt = performance.now();
        setReady(true);
      }
      measureRef.current();
      wakeRef.current();
    });
    return () => {
      cancelled = true;
    };
  }, [sourcesKey]);

  useEffect(() => {
    if (!leaving) return undefined;
    const timer = setTimeout(() => setLeaving(null), SWAP_LENGTH + SWAP_SPREAD);
    return () => clearTimeout(timer);
  }, [leaving]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const measure = () => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      const availW = Math.max(200, rect.width - 32);
      const availH = Math.max(180, rect.height - (s.captions ? CAPTION_SPACE : 24));
      const spanW = s.axis === 'y' ? s.radius * 2 + s.cardW * 0.45 : s.cardW * 1.15;
      const spanH = s.axis === 'x' ? s.radius * 2 + s.cardH * 0.45 : s.cardH * 1.25;
      const fit = clamp(Math.min(availW / spanW, availH / spanH, 1.18), 0.38, 1.18);
      stateRef.current.fit = fit;
      stateRef.current.drop = s.captions ? -CAPTION_SPACE * 0.32 : 0;
      wakeRef.current();
    };

    measureRef.current = measure;
    measure();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(root);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [radius, cardW, cardH, axis, captions]);

  useEffect(() => {
    let rafId = 0;
    let running = false;

    const renderFrame = (now) => {
      const s = settingsRef.current;
      const state = stateRef.current;
      const dt = state.last ? Math.min(0.064, (now - state.last) / 1000) : 1 / 60;
      state.last = now;

      // Intro progress
      const introDuration = INTRO_LENGTH[s.intro] || 0;
      let introProgress = 1;
      if (!state.introDone) {
        if (!state.intro) state.intro = now;
        if (introDuration <= 0) {
          state.introDone = true;
          introProgress = 1;
        } else {
          introProgress = clamp((now - state.intro) / introDuration, 0, 1);
          if (introProgress >= 1) state.introDone = true;
        }
      }
      const easedIntro = easeOutQuint(introProgress);

      // Physics & Autoplay
      const isPaused = (s.pauseOnHover && state.hover) || now < state.holdUntil;
      if (!state.drag) {
        if (state.target !== null) {
          const diff = state.target - state.angle;
          const accel = diff * SPRING - state.velocity * 18;
          state.velocity += accel * dt;
          state.angle += state.velocity * dt;
          if (Math.abs(diff) < 0.08 && Math.abs(state.velocity) < 0.6) {
            state.angle = state.target;
            state.velocity = 0;
            state.target = null;
          }
        } else if (s.autoplay === 'drift' && !isPaused) {
          const desired = state.dir * s.speed;
          state.velocity += (desired - state.velocity) * Math.min(1, dt * 4.5);
          state.angle += state.velocity * dt;
        } else if (s.autoplay === 'step' && !isPaused) {
          if (now - state.stepAt >= s.interval * 1000) {
            state.stepAt = now;
            const snapped = Math.round(state.angle / s.step) * s.step;
            state.target = snapped + state.dir * s.step;
          }
          state.velocity *= Math.pow(1 - clamp(1 - s.momentum, 0.05, 0.95), dt * 60);
          state.angle += state.velocity * dt;
        } else {
          const friction = Math.pow(clamp(s.momentum, 0.15, 0.96), dt * 10);
          state.velocity *= friction;
          state.angle += state.velocity * dt;

          if (s.snap && Math.abs(state.velocity) < SETTLE_SPEED) {
            const nearest = Math.round(state.angle / s.step) * s.step;
            if (Math.abs(nearest - state.angle) > 0.08) {
              state.target = nearest;
            } else {
              state.angle = nearest;
              state.velocity = 0;
            }
          } else if (Math.abs(state.velocity) < 0.05) {
            state.velocity = 0;
          }
        }
      }

      // Pointer parallax interpolation
      const targetYaw = state.pointer.inside ? state.pointer.x * 14 * s.parallax : 0;
      const targetPitch = state.pointer.inside ? -state.pointer.y * 10 * s.parallax : 0;
      state.yaw += (targetYaw - state.yaw) * Math.min(1, dt * 8);
      state.pitch += (targetPitch - state.pitch) * Math.min(1, dt * 8);

      // Velocity stretch factor
      const speedNorm = clamp(Math.abs(state.velocity) / 140, 0, 1);
      const stretchScale = 1 + speedNorm * 0.12 * s.stretch;

      // Apply stage & camera transforms
      if (stageRef.current) {
        stageRef.current.style.perspective = s.perspective > 0 ? `${s.perspective}px` : 'none';
      }

      if (cameraRef.current) {
        const introDrop = s.intro === 'rise' ? (1 - easedIntro) * 110 : 0;
        const introSpin = s.intro === 'spin' ? (1 - easedIntro) * -140 * state.dir : 0;
        const camTilt = s.tilt + state.pitch;
        const camYaw = state.yaw + (s.axis === 'y' ? introSpin : 0);
        const camRoll = s.axis === 'x' ? introSpin : 0;
        const pushZ = s.layout.inward ? s.radius * 0.35 : -s.radius * 0.22;

        cameraRef.current.style.transform = `translate3d(0px, ${state.drop + introDrop}px, ${pushZ}px) scale(${state.fit}) rotateX(${camTilt + camRoll}deg) rotateY(${camYaw}deg)`;
      }

      // Update cards and find closest active card
      let bestIndex = 0;
      let bestDist = Infinity;

      for (let i = 0; i < s.count; i += 1) {
        const cardEl = cardRefs.current[i];
        if (!cardEl) continue;

        const itemAngle = i * s.step + state.angle;
        const rel = wrap(itemAngle);
        const absRel = Math.abs(rel);
        if (absRel < bestDist) {
          bestDist = absRel;
          bestIndex = i;
        }

        const rad = rel * TO_RAD;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // Assemble intro radial expansion
        const curRadius =
          s.intro === 'assemble' ? s.radius * (0.25 + 0.75 * easeOut(introProgress)) : s.radius;

        const zSign = s.layout.inward ? -1 : 1;
        let pos =
          s.axis === 'x'
            ? rotateX([0, 0, curRadius * zSign], rel)
            : rotateY([0, 0, curRadius * zSign], rel);

        const cardRot = s.layout.billboard
          ? 'rotateX(0deg) rotateY(0deg)'
          : s.axis === 'x'
            ? `rotateX(${rel}deg)`
            : `rotateY(${rel}deg)`;

        const sx = s.axis === 'y' ? stretchScale : 1;
        const sy = s.axis === 'x' ? stretchScale : 1;

        cardEl.style.transform = `translate3d(${pos[0].toFixed(2)}px, ${pos[1].toFixed(2)}px, ${pos[2].toFixed(2)}px) ${cardRot} scale3d(${sx.toFixed(3)}, ${sy.toFixed(3)}, 1)`;

        // Depth shading (0 at front, 1 at back)
        const depth = s.layout.inward ? clamp((1 + cos) * 0.5, 0, 1) : clamp((1 - cos) * 0.5, 0, 1);
        cardEl.style.setProperty('--cc-depth', (depth * s.depthFade).toFixed(3));

        // Visibility window & backface culling
        let visible = true;
        if (!s.layout.backfaces && cos < -0.05) {
          visible = false;
        }
        if (s.layout.window > 0 && absRel > s.step * s.layout.window) {
          visible = false;
        }
        cardEl.style.visibility = visible ? 'visible' : 'hidden';
        cardEl.style.zIndex = String(Math.round((cos + 1) * 500));
        // Subtle front highlight
        cardEl.dataset.active = absRel < s.step * 0.5 ? 'true' : 'false';
        if ( sin ) {
          // keep reference
        }
      }

      if (bestIndex !== activeRef.current && s.count > 0) {
        activeRef.current = bestIndex;
        setActive(bestIndex);
        onChangeRef.current?.(bestIndex, listRef.current[bestIndex]);
      }

      const stillMoving =
        state.drag ||
        !state.introDone ||
        state.target !== null ||
        Math.abs(state.velocity) > 0.08 ||
        (s.autoplay !== 'off' && !isPaused) ||
        Math.abs(targetYaw - state.yaw) > 0.05 ||
        Math.abs(targetPitch - state.pitch) > 0.05;

      if (stillMoving) {
        rafId = requestAnimationFrame(renderFrame);
      } else {
        running = false;
        state.last = 0;
      }
    };

    const wake = () => {
      if (!running) {
        running = true;
        stateRef.current.last = 0;
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    wakeRef.current = wake;
    wake();

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const focusIndex = useCallback((index) => {
    const s = settingsRef.current;
    const state = stateRef.current;
    if (s.count <= 0) return;
    const currentItemAngle = index * s.step + state.angle;
    const delta = -wrap(currentItemAngle);
    state.target = state.angle + delta;
    state.holdUntil = performance.now() + 2600;
    state.stepAt = performance.now();
    wakeRef.current();
  }, []);

  const handlePointerDown = (e) => {
    const s = settingsRef.current;
    if (!s.draggable || e.button > 0) return;
    const state = stateRef.current;
    state.press = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: performance.now(),
    };
    state.target = null;
    state.suppressClick = false;
  };

  const handlePointerMove = (e) => {
    const root = rootRef.current;
    const s = settingsRef.current;
    const state = stateRef.current;

    if (root) {
      const rect = root.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
      state.pointer.inside = true;
      state.pointer.x = clamp(nx, -1, 1);
      state.pointer.y = clamp(ny, -1, 1);
      wakeRef.current();
    }

    if (!state.press || state.press.id !== e.pointerId) return;

    const dx = e.clientX - state.press.startX;
    const dy = e.clientY - state.press.startY;
    const primaryDelta = s.axis === 'x' ? dy : dx;

    if (!state.drag && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      state.drag = true;
      state.suppressClick = true;
      setDragging(true);
      rootRef.current?.setPointerCapture?.(e.pointerId);
    }

    if (state.drag) {
      const now = performance.now();
      const dt = Math.max(0.008, (now - state.press.lastTime) / 1000);
      const stepPx = s.axis === 'x' ? -(e.clientY - state.press.lastY) : e.clientX - state.press.lastX;
      const degPerPx = (180 / Math.PI / Math.max(120, s.radius * state.fit)) * dragSign;
      const deltaAngle = stepPx * degPerPx;

      state.angle += deltaAngle;
      state.velocity = clamp(deltaAngle / dt, -520, 520);
      state.press.lastX = e.clientX;
      state.press.lastY = e.clientY;
      state.press.lastTime = now;
      state.holdUntil = now + 1800;
      wakeRef.current();
    } else if (primaryDelta) {
      // keep reference
    }
  };

  const endPointer = (e) => {
    const state = stateRef.current;
    if (!state.press || (e && state.press.id !== e.pointerId)) return;
    if (state.drag) {
      rootRef.current?.releasePointerCapture?.(state.press.id);
    }
    state.press = null;
    state.drag = false;
    setDragging(false);
    state.holdUntil = performance.now() + 1400;
    wakeRef.current();
  };

  const handleCardClick = (item, index) => {
    const state = stateRef.current;
    if (state.suppressClick) {
      state.suppressClick = false;
      return;
    }
    if (focusOnClick && index !== activeRef.current) {
      focusIndex(index);
      return;
    }
    onItemClick?.(item, index);
  };

  const handleKeyDown = (e) => {
    const s = settingsRef.current;
    const state = stateRef.current;
    const prevKey = s.axis === 'x' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = s.axis === 'x' ? 'ArrowDown' : 'ArrowRight';
    if (e.key === prevKey || e.key === nextKey) {
      e.preventDefault();
      const dir = e.key === nextKey ? -1 : 1;
      const base = state.target ?? Math.round(state.angle / s.step) * s.step;
      state.target = base + dir * s.step * dragSign;
      state.holdUntil = performance.now() + 2400;
      wakeRef.current();
    }
  };

  const activeItem = list[active] || list[0];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-roledescription="3D circular carousel"
      aria-label="3D Product Showcase"
      data-axis={axis}
      data-shape={shape}
      data-draggable={draggable ? '' : undefined}
      data-dragging={dragging ? '' : undefined}
      data-ready={ready ? '' : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onMouseEnter={() => {
        stateRef.current.hover = true;
        wakeRef.current();
      }}
      onMouseLeave={() => {
        stateRef.current.hover = false;
        stateRef.current.pointer.inside = false;
        wakeRef.current();
      }}
      onKeyDown={handleKeyDown}
      className={`circular-carousel ${className}`.trim()}
      style={{
        '--cc-fade': fadeColor,
        '--cc-radius': `${cornerRadius}px`,
        '--cc-inner': innerShade,
        ...style,
      }}
    >
      <div className="circular-carousel__view">
        <div ref={stageRef} className="circular-carousel__stage">
          <div ref={cameraRef} className="circular-carousel__camera">
            <div ref={ringRef} className="circular-carousel__ring">
              {list.map((item, index) => {
                const leavingItem = leaving?.items?.[index];
                return (
                  <div
                    key={item.id || `${item.src}-${index}`}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    onClick={() => handleCardClick(item, index)}
                    className="circular-carousel__card"
                  >
                    {tiles.map((tile) => {
                      const isFirst = tile.index === 0;
                      const isLast = tile.index === tile.total - 1;
                      const r = `${cornerRadius}px`;
                      const borderRadius =
                        axis === 'x'
                          ? `${isFirst ? r : '0px'} ${isFirst ? r : '0px'} ${isLast ? r : '0px'} ${isLast ? r : '0px'}`
                          : `${isFirst ? r : '0px'} ${isLast ? r : '0px'} ${isLast ? r : '0px'} ${isFirst ? r : '0px'}`;

                      const tileStyle =
                        axis === 'x'
                          ? {
                              width: `${cardW}px`,
                              height: `${tile.size}px`,
                              left: `${-cardW / 2}px`,
                              top: `${-tile.size / 2}px`,
                              transform: tile.move,
                            }
                          : {
                              width: `${tile.size}px`,
                              height: `${cardH}px`,
                              left: `${-tile.size / 2}px`,
                              top: `${-cardH / 2}px`,
                              transform: tile.move,
                            };

                      const photoStyle =
                        axis === 'x'
                          ? {
                              width: `${cardW}px`,
                              height: `${cardH}px`,
                              left: '0px',
                              top: `${-tile.start}px`,
                            }
                          : {
                              width: `${cardW}px`,
                              height: `${cardH}px`,
                              left: `${-tile.start}px`,
                              top: '0px',
                            };

                      return (
                        <div key={tile.index} className="circular-carousel__tile" style={tileStyle}>
                          <div className="circular-carousel__frame" style={{ borderRadius }}>
                            <img
                              src={item.src}
                              alt={item.alt || item.title || ''}
                              draggable={false}
                              className="circular-carousel__photo"
                              style={photoStyle}
                            />
                            {leavingItem && (
                              <img
                                src={leavingItem.src}
                                alt=""
                                draggable={false}
                                className="circular-carousel__photo circular-carousel__photo--leaving"
                                style={{
                                  ...photoStyle,
                                  animationDelay: `${(index / Math.max(1, count)) * SWAP_SPREAD}ms`,
                                }}
                              />
                            )}
                            <div className="circular-carousel__shade" />
                          </div>
                        </div>
                      );
                    })}

                    {/* Backface inner shade tile when backfaces are visible */}
                    {layout.backfaces &&
                      tiles.map((tile) => {
                        const isFirst = tile.index === 0;
                        const isLast = tile.index === tile.total - 1;
                        const r = `${cornerRadius}px`;
                        const borderRadius =
                          axis === 'x'
                            ? `${isFirst ? r : '0px'} ${isFirst ? r : '0px'} ${isLast ? r : '0px'} ${isLast ? r : '0px'}`
                            : `${isFirst ? r : '0px'} ${isLast ? r : '0px'} ${isLast ? r : '0px'} ${isFirst ? r : '0px'}`;

                        const backMove =
                          axis === 'x'
                            ? `${tile.move} rotateX(180deg)`
                            : `${tile.move} rotateY(180deg)`;

                        const tileStyle =
                          axis === 'x'
                            ? {
                                width: `${cardW}px`,
                                height: `${tile.size}px`,
                                left: `${-cardW / 2}px`,
                                top: `${-tile.size / 2}px`,
                                transform: backMove,
                              }
                            : {
                                width: `${tile.size}px`,
                                height: `${cardH}px`,
                                left: `${-tile.size / 2}px`,
                                top: `${-cardH / 2}px`,
                                transform: backMove,
                              };

                        const photoStyle =
                          axis === 'x'
                            ? {
                                width: `${cardW}px`,
                                height: `${cardH}px`,
                                left: '0px',
                                top: `${-tile.start}px`,
                                transform: 'scaleY(-1)',
                              }
                            : {
                                width: `${cardW}px`,
                                height: `${cardH}px`,
                                left: `${-tile.start}px`,
                                top: '0px',
                                transform: 'scaleX(-1)',
                              };

                        return (
                          <div
                            key={`back-${tile.index}`}
                            className="circular-carousel__tile"
                            style={tileStyle}
                          >
                            <div className="circular-carousel__frame" style={{ borderRadius }}>
                              <img
                                src={item.src}
                                alt=""
                                draggable={false}
                                className="circular-carousel__photo"
                                style={photoStyle}
                              />
                              <div className="circular-carousel__inner" />
                              <div className="circular-carousel__shade" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {captions && activeItem && (
        <div className="circular-carousel__caption">
          <div key={active} className="circular-carousel__title">
            <span>{activeItem.title}</span>
            {activeItem.subtitle && (
              <span className="circular-carousel__subtitle">{activeItem.subtitle}</span>
            )}
          </div>
          <div className="circular-carousel__count">
            <Digits value={active + 1} />
            <span className="circular-carousel__slash">/</span>
            <span>{String(count).padStart(2, '0')}</span>
          </div>
        </div>
      )}

      <div className="circular-carousel__live" aria-live="polite">
        {activeItem ? `${activeItem.title || ''} ${activeItem.subtitle || ''}` : ''}
      </div>
    </div>
  );
};

export default CircularCarousel;
