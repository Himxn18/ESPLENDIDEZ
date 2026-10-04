import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ArrowUpRight, Flame, Lightbulb, Gamepad2, Cpu, Music, Sparkles } from "lucide-react";

/* ============ EDIT HERE ============ */
const VIDEO_RATIO = "16 / 9"; // your video's real shape, so none of it is ever cropped (e.g. "9 / 16" for vertical)
const HERO_STATS = [["3", "Days"], ["22", "Events"], ["5", "Arenas"], ["₹1.5L+", "Prizes"]];

const CSS = `
.hz-grad{background:linear-gradient(100deg,#fff 0%,#9BB4FF 25%,#C4A3FF 50%,#F2A6D0 75%,#fff 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:hzflow 9s ease-in-out infinite alternate}
@keyframes hzflow{to{background-position:100% 0}}
.hz-echo{position:absolute;inset:0;color:transparent;-webkit-text-stroke:1px rgba(196,163,255,.4);pointer-events:none;user-select:none;animation:hzecho 6s ease-in-out infinite alternate}
.hz-echo.e2{-webkit-text-stroke-color:rgba(155,180,255,.22);animation-delay:-2.5s}
@keyframes hzecho{from{transform:translate3d(0,0,0)}to{transform:translate3d(var(--ex,8px),var(--ey,6px),0)}}
.hz-rise{animation:hzrise .9s cubic-bezier(.2,.7,.2,1) both}@keyframes hzrise{from{opacity:0;transform:translateY(22px)}}
.hz-float{animation:hzfloat var(--dur,7s) ease-in-out var(--del,0s) infinite alternate}@keyframes hzfloat{from{transform:translateY(-8px) rotate(-4deg)}to{transform:translateY(10px) rotate(4deg)}}
.hz-spin{animation:hzspin 22s linear infinite}@keyframes hzspin{to{transform:rotate(360deg)}}
.hz-pulse{animation:hzpulse 4s ease-in-out infinite alternate}@keyframes hzpulse{from{opacity:.4}to{opacity:.95}}
.hz-marq{animation:hzmarq 40s linear infinite}@keyframes hzmarq{to{transform:translateX(-50%)}}
.hz-beam{transform-origin:top center;animation:hzbeam 8s ease-in-out infinite alternate}@keyframes hzbeam{from{transform:rotate(-14deg)}to{transform:rotate(14deg)}}
.hz-rec{animation:hzrec 1.4s ease-in-out infinite}@keyframes hzrec{50%{opacity:.25}}
.hz-spark{left:0;animation:hzsp 5s ease-in-out infinite alternate}@keyframes hzsp{to{left:calc(100% - 4rem)}}

/* ESPLENDIDEZ: letters arrive one at a time (even ones drop from above, odd ones rise from below), each with a colour
   burst that settles into the flowing gradient. When the last letter lands a glow rolls across the word.
   Tapping or clicking a letter sends a ripple through its neighbours. */
.hz-title{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.hz-l{display:inline-block;position:relative;will-change:transform;
  background:linear-gradient(100deg,#fff 0%,#8FD3FF 18%,#9BB4FF 36%,#C4A3FF 56%,#F2A6D0 78%,#fff 100%);
  background-size:1100% 100%;background-position:var(--p) 0;-webkit-background-clip:text;background-clip:text;color:transparent;
  transition:transform .35s cubic-bezier(.16,1,.3,1);
  animation:hzin 1.1s cubic-bezier(.22,1,.36,1) var(--d,0s) backwards,hzshift 10s linear 3.2s infinite,hzwave 7s ease-in-out var(--w,3.2s) infinite}
@media (hover:hover){.hz-l:hover{transform:translateY(-10px) scale(1.07)}}
@keyframes hzin{0%{opacity:0;transform:translate3d(0,var(--from),0) rotateX(var(--rx)) scale(.8);filter:blur(12px) brightness(2.2) hue-rotate(var(--hue))}
 45%{opacity:1}
 68%{transform:translate3d(0,var(--over),0) rotateX(0) scale(1.04);filter:blur(0) brightness(1.25) hue-rotate(calc(var(--hue) * .25))}
 100%{opacity:1;transform:translate3d(0,0,0) rotateX(0) scale(1);filter:blur(0) brightness(1) hue-rotate(0deg)}}
@keyframes hzshift{from{background-position:var(--p) 0}to{background-position:calc(var(--p) + 110%) 0}}
@keyframes hzwave{0%,35%,100%{filter:none}15%{filter:brightness(1.8) drop-shadow(0 0 22px rgba(196,163,255,.85))}}
.hz-bloom{position:absolute;inset:-14% -4%;z-index:0;pointer-events:none;background:radial-gradient(55% 70% at 50% 55%,rgba(196,163,255,.5),rgba(143,211,255,.18) 50%,transparent 75%);animation:hzbloom 7s ease-in-out 3s infinite backwards}
@keyframes hzbloom{0%{opacity:.15}15%{opacity:1}45%,100%{opacity:.15}}
.hz-hint{display:none}@media (hover:none){.hz-hint{display:block}}

/* the screen */
.hz-orbit{position:absolute;left:50%;top:50%;width:230%;aspect-ratio:1;translate:-50% -50%;pointer-events:none;
  background:conic-gradient(transparent 0 52%,#8FD3FF 66%,#C4A3FF 80%,#F2A6D0 92%,#fff 98%,transparent);animation:hzorbit 6s linear infinite}
@keyframes hzorbit{to{rotate:360deg}}
.hz-on{animation:hzon 1.1s cubic-bezier(.7,0,.2,1) .9s backwards}
@keyframes hzon{0%{clip-path:inset(49.2% 42% 49.2% 42%)}35%{clip-path:inset(49.2% 0 49.2% 0)}100%{clip-path:inset(0)}}
.hz-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;animation:hzflash 1.1s ease-out .9s backwards}
@keyframes hzflash{0%{opacity:.85}35%{opacity:.45}100%{opacity:0}}
.hz-streak{position:absolute;inset-block:0;left:0;width:26%;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.15),transparent);transform:skewX(-18deg);translate:-150% 0;animation:hzstreak 7s ease-in-out 2.4s infinite}
@keyframes hzstreak{0%{translate:-150% 0}24%,100%{translate:560% 0}}
.hz-eq{width:3px;height:12px;border-radius:2px;background:linear-gradient(#8FD3FF,#F2A6D0);transform-origin:bottom;animation:hzeq 1s ease-in-out infinite}
@keyframes hzeq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
[data-off] *,[data-off]{animation-play-state:paused !important}
@media (prefers-reduced-motion:reduce){.hz-l,.hz-bloom,.hz-orbit,.hz-on,.hz-flash,.hz-streak,.hz-eq,.hz-spark,.hz-grad,.hz-echo,.hz-rise,.hz-float,.hz-spin,.hz-pulse,.hz-marq,.hz-beam,.hz-rec{animation:none}}
`;

const btnGold = "inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B9C6FF] via-[#B4A4FF] to-[#E9A8D6] px-6 py-3 text-sm font-semibold text-[#0B0B1A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#A9A4FF]/25 sm:w-auto";
const btnGhost = "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-400/60 hover:bg-white/5 sm:w-auto";
const fillText = "bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] bg-clip-text text-transparent";
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const NAME = "ESPLENDIDEZ".split("");
const SHEEN = "radial-gradient(160px circle at var(--tx,-999px) var(--ty,-999px),#000 0%,transparent 70%)";

function useMedia(q) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const m = window.matchMedia(q);
        const f = () => setOn(m.matches);
        f(); m.addEventListener("change", f);
        return () => m.removeEventListener("change", f);
    }, [q]);
    return on;
}

/* Paints a tiny copy of the video a few times a second (cheap, no filters). */
function usePaint(videoRef, canvasRef, w, h, active, ms) {
    useEffect(() => {
        const ctx = canvasRef.current.getContext("2d");
        let id, last = 0;
        const loop = (t) => {
            id = requestAnimationFrame(loop);
            if (!active || t - last < ms) return;
            last = t;
            const v = videoRef.current;
            if (v && v.readyState >= 2) { try { ctx.drawImage(v, 0, 0, w, h); } catch (e) { /* ignore */ } }
        };
        id = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(id);
    }, [active, videoRef, canvasRef, w, h, ms]);
}

/* The colours of the footage glow softly behind the whole hero. */
function Ambient({ videoRef, active, ms }) {
    const c = useRef(null);
    usePaint(videoRef, c, 32, 18, active, ms);
    return <canvas ref={c} width="32" height="18" className="absolute inset-0 h-full w-full opacity-45" aria-hidden="true" />;
}

/* A glossy "floor" reflection of the screen. */
function Reflection({ videoRef, active, ms }) {
    const c = useRef(null);
    usePaint(videoRef, c, 128, 72, active, ms);
    const m = "linear-gradient(to bottom,rgba(0,0,0,.45),transparent)";
    return (
        <div className="pointer-events-none absolute inset-x-1 top-full mt-2 h-[26%] overflow-hidden" style={{ maskImage: m, WebkitMaskImage: m }} aria-hidden="true">
            <canvas ref={c} width="128" height="72" className="w-full" style={{ height: "384.6%", transform: "scaleY(-1)" }} />
        </div>
    );
}

/* Buttons that lean towards the mouse. */
function Mag({ as: Tag = "a", className, children, ...p }) {
    const ref = useRef(null);
    const mv = (e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.18}px,${(e.clientY - (r.top + r.height / 2)) * 0.3}px)`;
    };
    return <Tag ref={ref} onPointerMove={mv} onPointerLeave={() => { ref.current.style.transform = ""; }} className={className} {...p}>{children}</Tag>;
}

/* Whole numbers count up once the page has loaded. */
function Count({ v }) {
    const n = /^\d+$/.test(v) ? Number(v) : null;
    const [x, setX] = useState(n === null ? v : 0);
    useEffect(() => {
        if (n === null) return;
        let id; const t0 = performance.now() + 1100;
        const f = (t) => { const p = Math.min(1, Math.max(0, (t - t0) / 1300)); setX(Math.round(n * (1 - Math.pow(1 - p, 3)))); if (p < 1) id = requestAnimationFrame(f); };
        id = requestAnimationFrame(f);
        return () => cancelAnimationFrame(id);
    }, [n]);
    return <>{x}</>;
}

const Corner = ({ cls }) => <span className={`pointer-events-none absolute h-4 w-4 border-[#C4A3FF] ${cls}`} aria-hidden="true" />;

/* The fest name. Letters alternate: one drops in from above, the next rises from below, each with a colour burst
   that settles into the flowing gradient. When the last letter lands, a glow rolls across the word. */
function Title({ wrapRef, off }) {
    const ref = useRef(null);
    const move = (e) => {
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--tx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--ty", `${e.clientY - r.top}px`);
    };
    /* tap or click a letter: it jumps, glows and changes colour, and the ripple spreads to the letters beside it */
    const ripple = (e) => {
        const t = e.target.closest ? e.target.closest(".hz-l") : null;
        if (!t || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const letters = [...ref.current.querySelectorAll(".hz-l")];
        const i = letters.indexOf(t);
        letters.forEach((el, j) => {
            const d = Math.abs(j - i), sc = Math.max(1, 1.3 - d * 0.07);
            el.animate([
                { transform: "translate3d(0,0,0) scale(1)", filter: "none" },
                { transform: `translate3d(0,${-22 + d * 2}%,0) scale(${sc}) rotate(${j % 2 ? 4 : -4}deg)`, filter: `brightness(${Math.max(1.1, 2 - d * 0.1)}) drop-shadow(0 0 22px rgba(196,163,255,.95)) hue-rotate(${-40 + d * 8}deg)`, offset: 0.35 },
                { transform: "translate3d(0,3%,0) scale(.97)", offset: 0.7 },
                { transform: "translate3d(0,0,0) scale(1)", filter: "none" },
            ], { duration: 750, delay: d * 55, easing: "cubic-bezier(.2,.8,.2,1)" });
        });
    };
    return (
        <div ref={wrapRef} className="w-fit max-w-full will-change-transform">
            <h1 ref={ref} data-off={off || undefined} onPointerMove={move} onPointerDown={ripple} onContextMenu={(e) => e.preventDefault()} onPointerLeave={() => ref.current.style.setProperty("--tx", "-999px")}
                aria-label="ESPLENDIDEZ '27" className="hz-title relative isolate mt-6 w-fit max-w-full cursor-pointer select-none text-[clamp(2.2rem,10.4vw,8rem)] font-extrabold leading-[0.95] tracking-tight [perspective:800px]">
                <span className="hz-bloom" aria-hidden="true" />
                <span className="hz-echo e1" style={{ "--ex": "10px", "--ey": "8px" }} aria-hidden="true">ESPLENDIDEZ</span>
                <span className="hz-echo e2" style={{ "--ex": "20px", "--ey": "16px" }} aria-hidden="true">ESPLENDIDEZ</span>
                <span className="relative z-10 block pb-2" aria-hidden="true">
                    {NAME.map((ch, i) => {
                        const up = i % 2 === 0;
                        return (
                            <span key={i} className="hz-l" style={{ "--d": `${0.55 + i * 0.15}s`, "--w": `${3.2 + i * 0.07}s`, "--p": `${(i / 10) * 100}%`, "--from": up ? "-170%" : "170%", "--over": up ? "7%" : "-7%", "--rx": up ? "65deg" : "-65deg", "--hue": up ? "-90deg" : "90deg" }}>{ch}</span>
                        );
                    })}
                </span>
                <span className="pointer-events-none absolute inset-0 z-20 text-white" style={{ maskImage: SHEEN, WebkitMaskImage: SHEEN, textShadow: "0 0 26px rgba(196,163,255,.95)" }} aria-hidden="true">ESPLENDIDEZ</span>
            </h1>
            <div className="hz-rise mt-3 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400 sm:text-xs" style={{ animationDelay: "3s" }} aria-hidden="true">
                <span>Est. 2011</span>
                <span className="relative h-px flex-1 bg-gradient-to-r from-[#9BB4FF]/70 via-[#C4A3FF]/70 to-[#F2A6D0]/70">
                    <span className="hz-spark absolute -top-[3px] h-[7px] w-16 rounded-full" style={{ background: "radial-gradient(closest-side,#fff,rgba(196,163,255,.6) 50%,transparent)" }} />
                </span>
                <span>Edition '27</span>
            </div>
            <p className="hz-hint hz-rise mt-2 text-[10px] uppercase tracking-[0.25em] text-zinc-500" style={{ animationDelay: "3.4s" }} aria-hidden="true">Tap the letters</p>
        </div>
    );
}

export default function Hero({ videoSrc, tagline, logo, words = [], paused = false, onTeaser, wave }) {
    const secRef = useRef(null), gridRef = useRef(null), tilt = useRef(null), vref = useRef(null), bar = useRef(null), time = useRef(null);
    const titleWrap = useRef(null), frameWrap = useRef(null), userPaused = useRef(false);
    const [playing, setPlaying] = useState(true), [muted, setMuted] = useState(true), [fail, setFail] = useState(false), [inView, setInView] = useState(true);
    const isLg = useMedia("(min-width:1024px)");
    const off = !inView || paused;

    useEffect(() => {
        const old = document.getElementById("hz-style"); if (old) old.remove();
        if (document.getElementById("hz-style-v2")) return;
        const s = document.createElement("style"); s.id = "hz-style-v2"; s.textContent = CSS; document.head.appendChild(s);
    }, []);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
        io.observe(secRef.current);
        return () => io.disconnect();
    }, []);
    useEffect(() => {
        const v = vref.current; if (!v) return;
        if (paused) v.pause(); else if (!userPaused.current) v.play().catch(() => { });
    }, [paused]);

    /* scroll depth: moves two elements directly (no style recalculation for the whole hero) */
    useEffect(() => {
        let raf;
        const on = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const el = secRef.current; if (!el) return;
                const p = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight * 0.8)));
                if (titleWrap.current) titleWrap.current.style.transform = `translate3d(0,${p * 34}px,0)`;
                if (frameWrap.current) frameWrap.current.style.transform = `translate3d(0,${-p * 28}px,0) scale(${1 - p * 0.05})`;
            });
        };
        window.addEventListener("scroll", on, { passive: true }); on();
        return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
    }, []);

    const toggle = () => {
        const v = vref.current; if (!v) return;
        if (v.paused) { userPaused.current = false; v.play().catch(() => { }); } else { userPaused.current = true; v.pause(); }
    };
    const mute = () => {
        const v = vref.current; if (!v) return;
        const next = !v.muted; v.muted = next;
        if (!next) { v.volume = 1; if (v.paused && !userPaused.current) v.play().catch(() => { }); }
        setMuted(next);
    };
    const onTime = () => {
        const v = vref.current; if (!v || !v.duration || !bar.current) return;
        bar.current.style.width = `${(v.currentTime / v.duration) * 100}%`;
        time.current.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration)}`;
    };
    const onMove = (e) => {
        if (gridRef.current) {
            const sr = secRef.current.getBoundingClientRect();
            gridRef.current.style.setProperty("--gx", `${e.clientX - sr.left}px`);
            gridRef.current.style.setProperty("--gy", `${e.clientY - sr.top}px`);
        }
        if (e.pointerType !== "mouse" || !tilt.current) return;
        const r = tilt.current.getBoundingClientRect();
        tilt.current.style.setProperty("--ry", `${((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 10}deg`);
        tilt.current.style.setProperty("--rx", `${-((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 10}deg`);
    };
    const onLeave = () => { if (tilt.current) { tilt.current.style.setProperty("--rx", "0deg"); tilt.current.style.setProperty("--ry", "0deg"); } };
    const ticker = words.length ? [0, 1, 2, 3].flatMap((k) => words.map((w, i) => ({ w, k: `${k}-${i}`, g: (i + k) % 3 === 0 }))) : [];
    const grid = "radial-gradient(260px circle at var(--gx,50%) var(--gy,30%),black,transparent 70%)";

    return (
        <section id="home" ref={secRef} data-off={off || undefined} onPointerMove={onMove} onPointerLeave={onLeave} className="relative isolate overflow-hidden pb-10 pt-28 lg:pb-16 lg:pt-36">
            {/* backdrop: colours of the video, a fine grid, stage beams and (desktop) the particle wave */}
            <div className="absolute inset-0 -z-10 overflow-hidden" style={{ maskImage: "linear-gradient(to bottom,black 55%,transparent)", WebkitMaskImage: "linear-gradient(to bottom,black 55%,transparent)" }} aria-hidden="true">
                {!fail && <Ambient videoRef={vref} active={!off} ms={isLg ? 160 : 260} />}
                <div className="absolute inset-0 bg-gradient-to-b from-[#07080A]/50 via-[#07080A]/60 to-[#07080A]" />
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.7) 1px,transparent 1px)", backgroundSize: "56px 56px", maskImage: "radial-gradient(ellipse at 50% 25%,black,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 25%,black,transparent 70%)" }} />
                <div ref={gridRef} className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(rgba(155,180,255,.55) 1px,transparent 1px),linear-gradient(90deg,rgba(155,180,255,.55) 1px,transparent 1px)", backgroundSize: "56px 56px", maskImage: grid, WebkitMaskImage: grid }} />
                <div className="hz-beam absolute -top-6 left-[18%] h-[70%] w-48 bg-gradient-to-b from-white/12 to-transparent" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} />
                <div className="hz-beam absolute -top-6 right-[16%] h-[70%] w-48 bg-gradient-to-b from-[#C4A3FF]/20 to-transparent [animation-direction:alternate-reverse]" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} />
                {isLg && <div className="absolute inset-0 opacity-30">{wave}</div>}
            </div>

            <div className="mx-auto grid max-w-6xl gap-y-9 px-5 sm:px-6 lg:grid-cols-12 lg:gap-x-10">
                {/* 1. brand, tagline, title */}
                <div className="lg:col-span-12">
                    <div className="hz-rise mb-5 empty:hidden" style={{ animationDelay: ".05s" }}>{logo}</div>
                    <div className="hz-rise w-fit max-w-full rounded-2xl bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] p-px sm:rounded-full" style={{ animationDelay: ".1s" }}>
                        <p className="flex items-center gap-2.5 rounded-[calc(1rem-1px)] bg-[#0B0C12]/90 px-4 py-2.5 text-[10.5px] font-medium uppercase leading-relaxed tracking-[0.14em] text-white sm:rounded-full sm:px-5 sm:text-xs sm:tracking-[0.18em]">
                            <Flame size={15} className="shrink-0 text-[#C4A3FF]" />{tagline}
                        </p>
                    </div>
                    <Title wrapRef={titleWrap} off={off} />
                </div>

                {/* 2. the screen: the whole video, never cropped */}
                <div className="hz-rise relative z-10 mb-12 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:-mt-8 lg:mb-16" style={{ animationDelay: ".45s" }}>
                    <div ref={frameWrap} className="will-change-transform">
                        <div ref={tilt} className="relative transition-transform duration-300 ease-out" style={{ transform: "perspective(1100px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))" }}>
                            <div className="hz-pulse pointer-events-none absolute -inset-6 sm:-inset-10" style={{ background: "radial-gradient(60% 60% at 50% 50%,rgba(196,163,255,.35),transparent 70%)" }} aria-hidden="true" />
                            {/* stacked ghost frames for depth */}
                            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/10 bg-white/[0.03]" style={{ transform: "rotate(-3deg) translateY(10px) scale(.95)" }} aria-hidden="true" />
                            <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/10 bg-white/[0.03]" style={{ transform: "rotate(3deg) translateY(18px) scale(.9)" }} aria-hidden="true" />

                            {/* frame with a light that races around its edge */}
                            <div className="relative overflow-hidden rounded-[1.75rem] bg-white/10 p-[1.5px] shadow-2xl shadow-black/50">
                                <span className="hz-orbit" aria-hidden="true" />
                                <div className="hz-on relative overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[#06070B] [contain:paint]" style={{ aspectRatio: VIDEO_RATIO }}>
                                    {!fail ? (
                                        <video ref={vref} src={videoSrc} autoPlay loop muted playsInline preload="auto" disablePictureInPicture onClick={toggle} onError={() => setFail(true)}
                                            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={onTime} className="h-full w-full cursor-pointer object-contain [transform:translateZ(0)]" />
                                    ) : (
                                        <div className="grid h-full place-items-center text-sm text-zinc-400"><span className="flex items-center gap-2"><Play size={18} /> Teaser video not found</span></div>
                                    )}
                                    <span className="hz-streak" aria-hidden="true" />
                                    <span className="hz-flash" aria-hidden="true" />
                                    <Corner cls="left-2.5 top-2.5 rounded-tl-md border-l-2 border-t-2" /><Corner cls="right-2.5 top-2.5 rounded-tr-md border-r-2 border-t-2" />
                                    <Corner cls="bottom-2.5 left-2.5 rounded-bl-md border-b-2 border-l-2" /><Corner cls="bottom-2.5 right-2.5 rounded-br-md border-b-2 border-r-2" />
                                    <span className="pointer-events-none absolute left-6 top-5 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
                                        <span className="hz-rec h-1.5 w-1.5 rounded-full bg-[#F2A6D0]" />Official teaser
                                        {!muted && playing && <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">{[0, 0.2, 0.4].map((d) => <span key={d} className="hz-eq" style={{ animationDelay: `${d}s` }} />)}</span>}
                                    </span>
                                    {!fail && (
                                        <>
                                            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
                                            <div className="absolute inset-x-5 bottom-5 flex items-center justify-between">
                                                <span ref={time} className="text-[11px] tabular-nums text-zinc-200">0:00 / 0:00</span>
                                                <div className="flex gap-2">
                                                    <button onClick={toggle} aria-label={playing ? "Pause video" : "Play video"} className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/60 transition hover:bg-white/15">{playing ? <Pause size={14} /> : <Play size={14} />}</button>
                                                    <button onClick={mute} aria-label={muted ? "Unmute" : "Mute"} className="relative grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/60 transition hover:bg-white/15">
                                                        {muted && <span className="absolute inset-0 animate-ping rounded-full border border-[#C4A3FF]/70" aria-hidden="true" />}
                                                        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="pointer-events-none absolute inset-x-5 bottom-3 h-[3px] rounded-full bg-white/20"><div ref={bar} className="h-full w-0 rounded-full bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0]" /></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {!fail && <Reflection videoRef={vref} active={!off} ms={isLg ? 120 : 220} />}
                            {/* rotating seal */}
                            <div className="absolute -right-2 -top-7 z-20 h-24 w-24 sm:-right-5 sm:-top-9 sm:h-32 sm:w-32" aria-hidden="true">
                                <div className="absolute inset-1 rounded-full border border-white/15 bg-[#0B0C12]/90" />
                                <svg viewBox="0 0 120 120" className="hz-spin absolute inset-0 h-full w-full">
                                    <defs><path id="hzring" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs>
                                    <text fill="rgba(255,255,255,.85)" fontSize="9.5" fontWeight="600"><textPath href="#hzring" textLength="290" lengthAdjust="spacing">ESPLENDIDEZ · USTM · 2027 · ENGINEERING ·</textPath></text>
                                </svg>
                                <span className="hz-grad absolute inset-0 grid place-items-center text-xl font-extrabold sm:text-3xl">'27</span>
                            </div>
                            {/* drifting icons (desktop) */}
                            {[[Gamepad2, "-left-7 top-1/4", 7, 0], [Music, "-left-4 bottom-10", 8.5, 1], [Cpu, "-right-6 bottom-1/3", 6.5, 0.6]].map(([I, pos, dur, del], i) => (
                                <span key={i} className={`hz-float absolute ${pos} z-20 hidden h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-[#12142A]/80 text-[#C4A3FF] shadow-lg shadow-black/30 lg:grid`} style={{ "--dur": `${dur}s`, "--del": `${del}s` }} aria-hidden="true"><I size={20} /></span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. message, actions, numbers */}
                <div className="hz-rise lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-center" style={{ animationDelay: ".6s" }}>
                    <p className="text-xl font-light leading-[1.55] tracking-[-0.01em] text-zinc-300 sm:text-2xl">
                        The flagship fest of the Engineering Department at USTM, run by its{" "}
                        <span className="hz-grad inline-block whitespace-normal pb-0.5 font-semibold">first engineering batch.</span>
                    </p>
                    <div className="mt-5 flex items-center gap-4">
                        <span className="h-0.5 w-10 shrink-0 rounded-full bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0]" />
                        <p className={`pb-0.5 text-base font-semibold leading-snug tracking-wide sm:text-lg ${fillText}`}>Where sport, technology and culture share one stage.</p>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Mag as="a" href="#events" className={btnGold}>Explore events <ArrowUpRight size={16} /></Mag>
                        <Mag as="button" onClick={onTeaser} className={btnGhost}><Play size={15} /> Watch with sound</Mag>
                    </div>
                    <a href="#updates" className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-white"><Lightbulb size={15} className="text-[#C4A3FF]" /> Stay tuned for updates <ArrowUpRight size={14} /></a>
                    <dl className="mt-8 grid grid-cols-4 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.04]">
                        {HERO_STATS.map(([v, l]) => (
                            <div key={l} className="px-1 py-3 text-center"><dd className={`text-lg font-semibold sm:text-xl ${fillText}`}><Count v={v} /></dd><dt className="text-[11px] text-zinc-400">{l}</dt></div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* arenas ticker */}
            {ticker.length > 0 && (
                <div className="mt-14 overflow-hidden border-y border-white/10 py-4 lg:mt-20" style={{ maskImage: "linear-gradient(90deg,transparent,black 12%,black 88%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,black 12%,black 88%,transparent)" }} aria-hidden="true">
                    <div className="hz-marq flex w-max gap-10">
                        {ticker.map(({ w, k, g }) => (
                            <span key={k} className="flex items-center gap-10 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
                                <span className={g ? fillText : ""} style={g ? undefined : { WebkitTextStroke: "1px rgba(255,255,255,.3)", color: "transparent" }}>{w}</span>
                                <Sparkles size={20} className="text-[#C4A3FF]" />
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}