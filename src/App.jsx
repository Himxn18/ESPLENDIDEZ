import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Hero from "./Hero";
import ThemeToggle from "./ThemeToggle";
import {
  Play, Pause, Volume2, VolumeX, X, ArrowUpRight, Trophy, Users, Building2,
  CalendarDays, Mail, MessageCircle, MapPin, Menu, Cpu, Gamepad2, Clock, Ticket,
  Lightbulb, Footprints, Mic, Shirt, Car, Swords, Heart, Sparkles, Sunrise, Sun, CloudSun, Sunset, Moon, Dumbbell, Music, Star, ChevronDown, Flame,
  Zap, Target, Flag, Medal, Timer, Crosshair, Code, Wrench, Bot, BookOpen, Brain, Crown, ArrowUp,
} from "lucide-react";

/* ============ EDIT YOUR REAL DETAILS HERE ============ */
const CONFIG = {
  videoSrc: "/ez-video.mp4", // public/ez-video.mp4
  artistImage: "/artist.webp", // public/artist.webp, background of the Main Artist card
  signImage: "/stay-tuned-bg.webp", // public/stay-tuned-bg.webp, background of the Stay tuned board
  logoSrc: "/ez-logo.png", // public/ez-logo.png (transparent PNG/SVG/WebP works best)
  registerUrl: "",
  tagline: "Carrying the spirit of 2011 into a new chapter at USTM.",
  waMessage: "Hello! I am reaching out regarding registration and event details for ESPLENDIDEZ '27 at USTM.",
};

const STATS = [
  { icon: Users, value: "5,000+", label: "Visitors" },
  { icon: Trophy, value: "₹1.5 Lakh+", label: "Prize money" },
  { icon: Cpu, value: "22", label: "Events" },
  { icon: Building2, value: "40+", label: "Universities" },
];

const CATEGORIES = ["All", "Sports", "Esports", "Technical", "Cultural", "Literary"];

/* Images live in public/events/ (file names below). Missing files fall back to a gradient + icon.
   Prize figures come from the organisers' prize sheet. */
const EVENTS = [
  { id: 1, cat: "Sports", name: "Futsal", image: "/events/futsal.webp", badge: "1st prize ₹7,500", p1: "₹7,500", p2: "₹4,000", p3: "₹2,500", note: "" },
  { id: 2, cat: "Sports", name: "Unity Run", image: "/events/unity-run.webp", badge: "1st prize ₹3,000 · boys & girls", p1: "Boys ₹3,000 · Girls ₹3,000", p2: "Boys ₹2,000 · Girls ₹2,000", p3: "", note: "" },
  { id: 3, cat: "Sports", name: "Kabaddi", image: "/events/kabaddi.webp", badge: "1st prize ₹6,000", p1: "₹6,000", p2: "₹4,000", p3: "", note: "Girls only" },
  { id: 4, cat: "Sports", name: "Tug of War", image: "/events/tug-of-war.webp", badge: "1st prize ₹5,000", p1: "₹5,000", p2: "₹3,000", p3: "", note: "" },
  { id: 5, cat: "Sports", name: "Badminton", image: "/events/badminton.webp", badge: "1st prize ₹3,500", p1: "₹3,500", p2: "₹2,500", p3: "₹1,500", note: "" },
  { id: 6, cat: "Sports", name: "Volleyball", image: "/events/volleyball.webp", badge: "1st prize ₹5,000", p1: "₹5,000", p2: "₹3,000", p3: "₹2,000", note: "" },
  { id: 7, cat: "Sports", name: "Table Tennis", image: "/events/table-tennis.webp", badge: "1st prize ₹3,000", p1: "₹3,000", p2: "₹2,000", p3: "", note: "" },
  { id: 8, cat: "Sports", name: "Arm Wrestling", image: "/events/arm-wrestling.webp", badge: "1st prize ₹2,500", p1: "₹2,500", p2: "₹1,500", p3: "", note: "" },
  { id: 9, cat: "Sports", name: "Power Lifting", image: "/events/power-lifting.webp", badge: "1st prize ₹3,000", p1: "₹3,000", p2: "₹2,000", p3: "", note: "" },
  { id: 10, cat: "Esports", name: "BGMI", image: "/events/bgmi.webp", badge: "1st prize ₹5,000", p1: "₹5,000", p2: "₹3,000", p3: "₹2,000", note: "" },
  { id: 11, cat: "Esports", name: "Mobile Legends", image: "/events/ml.webp", badge: "1st prize ₹4,500", p1: "₹4,500", p2: "₹2,500", p3: "₹1,500", note: "" },
  { id: 12, cat: "Esports", name: "FIFA", image: "/events/fifa.webp", badge: "1st prize ₹2,000", p1: "₹2,000", p2: "₹1,500", p3: "₹500", note: "" },
  { id: 13, cat: "Technical", name: "Coding Competition", image: "/events/coding.webp", badge: "1st prize ₹1,500", p1: "₹1,500", p2: "₹1,000", p3: "₹500", note: "" },
  { id: 14, cat: "Technical", name: "Model Making", image: "/events/model-making.webp", badge: "1st prize ₹3,000", p1: "₹3,000", p2: "₹2,000", p3: "₹1,000", note: "" },
  { id: 15, cat: "Technical", name: "Robot War", image: "/events/robot-war.webp", badge: "1st prize ₹5,500", p1: "₹5,500", p2: "₹4,500", p3: "", note: "" },
  { id: 16, cat: "Literary", name: "Debate", image: "/events/debate.webp", badge: "1st prize ₹4,000", p1: "₹4,000", p2: "₹2,000", p3: "", note: "" },
  { id: 17, cat: "Literary", name: "Quiz", image: "/events/quiz.webp", badge: "1st prize ₹3,000", p1: "₹3,000", p2: "₹2,000", p3: "", note: "3rd place: certificate only" },
  { id: 18, cat: "Cultural", name: "Dance Competition", image: "/events/dance.webp", badge: "1st prize ₹4,000+ & momento", p1: "₹4,000+ & momento", p2: "₹3,000+ & momento", p3: "₹2,000+ & momento", note: "" },
  { id: 19, cat: "Cultural", name: "Singing Competition", image: "/events/singing.webp", badge: "1st prize ₹3,000", p1: "₹3,000", p2: "₹2,000", p3: "₹1,000", note: "" },
  { id: 20, cat: "Cultural", name: "Fashion Show", image: "/events/fashion-show.webp", badge: "Prize details soon", p1: "", p2: "", p3: "", note: "Prize details to be announced" },
  { id: 21, cat: "Cultural", name: "Cosplay", image: "/events/cosplay.webp", badge: "1st prize ₹5,500", p1: "₹5,500", p2: "₹3,500", p3: "", note: "" },
  { id: 22, cat: "Cultural", name: "Prom Night", image: "/events/prom-night.webp", badge: "1st prize ₹5,000", p1: "₹5,000", p2: "₹3,000", p3: "", note: "" },
];

/* [time of day, title, icon, highlight?] */
const SCHEDULE = [
  {
    day: "Day 1", theme: "Opening", items: [
      ["Morning", "Unity Run", Footprints], ["Forenoon", "Inauguration", Sparkles, true],
      ["Afternoon", "E-Sports and Sports rounds", Gamepad2],
      ["Evening", "Robo War · Robotics · Coding", Cpu], ["Evening", "Singing · Fashion selection", Mic],
      ["Night", "The Golden Night", Star, true], ["Night", "Influencer talk", Users]]
  },
  {
    day: "Day 2", theme: "Finals and performances", items: [
      ["Morning", "BGMI · Mobile Legends finals", Gamepad2], ["Forenoon", "Bridge Making · Robo War", Swords],
      ["Afternoon", "Futsal · Kabaddi · Badminton · Volleyball finals", Dumbbell], ["Afternoon", "Car showcase", Car],
      ["Evening", "Dance · Fusion Folk · Cosplay", Music], ["Evening", "Local band", Mic],
      ["Night", "DJ night", Music, true]]
  },
  {
    day: "Day 3", theme: "Closing", items: [
      ["Morning", "Arm Wrestling · Weight Lifting", Dumbbell], ["Forenoon", "Blood donation", Heart],
      ["Afternoon", "Fashion show final · Cultural showdown", Shirt],
      ["Evening", "Prize distribution", Trophy, true], ["Night", "Main artist show", Star, "headliner"]]
  },
];
/* icon + colour per time of day: the colours shift from sky to deep violet as the day goes on */
const SLOTS = { Morning: [Sunrise, "#8FD3FF"], Forenoon: [Sun, "#9BB4FF"], Afternoon: [CloudSun, "#B4A4FF"], Evening: [Sunset, "#E39AD0"], Night: [Moon, "#9A7CFF"] };

const COORDINATORS = [
  { name: "David Momin", role: "Event Head", email: "", insta: "", phone: "919954798642" },
  { name: "Meghna Choudhury", role: "Event Head", email: "", insta: "", phone: "919395046265" },
  { name: "Akash Pratim Nath", role: "Overall Coordinator", email: "", insta: "", phone: "917577040546" },
];
const OFFICIAL = { email: "esplendidez27@gmail.com", insta: "esplendidez_27" };

const NAV = ["Home", "Events", "Updates", "Schedule", "About", "Contact"];
const waLink = (p) => `https://wa.me/${p}?text=${encodeURIComponent(CONFIG.waMessage)}`;
/* Register buttons: open the link in a new tab, or jump to Contact until a real link is set */
const regProps = CONFIG.registerUrl ? { href: CONFIG.registerUrl, target: "_blank", rel: "noreferrer" } : { href: "#contact" };

/* ============ Shared style tokens ============ */
const silver = "bg-gradient-to-r from-white via-zinc-100 to-[#B8C2FF] bg-clip-text text-transparent";
const gold = "bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] bg-clip-text text-transparent";
const card = "rounded-2xl border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-300 hover:border-zinc-500/50";
const btnGold = "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#B9C6FF] via-[#B4A4FF] to-[#E9A8D6] px-6 py-3 text-sm font-semibold text-[#0B0B1A] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#A9A4FF]/25";
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-zinc-400/60 hover:bg-white/5";

const Instagram = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

/* ============ Performance helpers ============ */
/* pauses every CSS animation inside an element while it is scrolled out of view */
function useOffscreenPause(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { el.dataset.off = e.isIntersecting ? "0" : "1"; }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

/* numbers count up once when scrolled into view ("₹1.5 Lakh+", "5,000+" both work) */
function CountUp({ value }) {
  const ref = useRef(null);
  const [txt, setTxt] = useState(value);
  useEffect(() => {
    const m = String(value).match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, num, suf] = m;
    const target = parseFloat(num.replace(/,/g, "")), dec = (num.split(".")[1] || "").length;
    const f = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    setTxt(pre + f(0) + suf);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const step = (t) => { const p = Math.min((t - t0) / 1400, 1); setTxt(pre + f(target * (1 - Math.pow(1 - p, 3))) + suf); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{txt}</span>;
}

/* ============ Scroll reveal (fades and lifts content in once) ============ */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`rv ${on ? "in" : ""} ${className}`} style={{ "--d": `${delay}s` }}>{children}</div>;
}

/* section title with a huge outlined index number and a glowing rule */
function SectionHead({ n, title, sub }) {
  return (
    <Reveal>
      <div className="relative">
        <span className="pointer-events-none absolute -left-2 -top-10 select-none text-[8rem] font-extrabold leading-none sm:text-[11rem]" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)", color: "transparent" }} aria-hidden="true">{n}</span>
        <h2 className={`relative text-4xl font-semibold tracking-tight sm:text-5xl ${silver}`}>{title}</h2>
        <span className="relative mt-4 block h-px w-24 bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-transparent shadow-[0_0_12px_rgba(196,163,255,0.8)]" aria-hidden="true" />
        {sub && <p className="relative mt-4 max-w-lg text-zinc-300">{sub}</p>}
      </div>
    </Reveal>
  );
}

/* quiet backdrop for a section: two soft glows, a fading dot texture and a hairline. Static, so no scroll cost */
function SectionGlow({ c1 = "155,180,255", c2 = "242,166,208", side = "left" }) {
  const other = side === "left" ? "right" : "left";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-24 h-[28rem] w-[28rem] rounded-full" style={{ [side]: "-9rem", background: `radial-gradient(closest-side, rgba(${c1},0.10), transparent)` }} />
      <div className="absolute bottom-0 h-[24rem] w-[24rem] rounded-full" style={{ [other]: "-7rem", background: `radial-gradient(closest-side, rgba(${c2},0.07), transparent)` }} />
    </div>
  );
}

/* ============ Floating glass icons; they drift and follow the pointer inside the hero ============ */
function FloatIcons({ items, show = "hidden sm:block" }) {
  return items.map(({ Icon, pos, depth = 20, size = 20, dur = 7, del = 0 }, i) => (
    <div key={i} aria-hidden="true" className={`pointer-events-none absolute z-[5] transition-transform duration-700 ease-out ${show} ${pos}`}
      style={{ transform: `translate3d(calc(var(--mx,0)*${depth}px),calc(var(--my,0)*${depth}px),0)` }}>
      <span className="float grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/[0.06] text-[#C4A3FF] shadow-lg shadow-black/30" style={{ "--dur": `${dur}s`, "--del": `${del}s` }}>
        <Icon size={size} />
      </span>
    </div>
  ));
}

/* ============ Headliner card for the Main Artist show ============ */
function Headliner() {
  const [bad, setBad] = useState(false);
  return (
    <div className="rounded-3xl bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] p-px shadow-[0_0_60px_-20px_rgba(196,163,255,0.6)] sm:col-span-2">
      <div className="relative min-h-[18rem] overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0B0C12]">
        {!bad && <img src={CONFIG.artistImage} alt="" onError={() => setBad(true)} className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C12] via-[#0B0C12]/60 to-[#0B0C12]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C12]/90 via-[#0B0C12]/40 to-transparent" />
        <div className="beam absolute -top-6 left-[18%] h-[130%] w-44 bg-gradient-to-b from-white/25 to-transparent blur-md" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
        <div className="beam absolute -top-6 right-[14%] h-[130%] w-44 bg-gradient-to-b from-[#C4A3FF]/30 to-transparent blur-md [animation-direction:alternate-reverse]" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
        <div className="relative flex min-h-[18rem] flex-col justify-end p-6 sm:p-10">
          <div className="absolute right-6 top-6 flex h-8 items-end gap-1 sm:right-10 sm:top-8" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => <span key={i} className="eq" style={{ animationDelay: `${i * 0.15}s` }} />)}
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-white"><Star size={12} className="text-[#F2A6D0]" /> Headliner</span>
          <h3 className="ez-grad mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Main Artist Show</h3>
          <p className="mt-3 max-w-md text-sm text-zinc-200 sm:text-base">Day 3 closes with the headline performance. The artist will be revealed on our Instagram page.</p>
          <span className="mt-5 inline-flex w-fit items-center gap-2 text-sm text-zinc-300"><Moon size={14} className="text-[#9A7CFF]" /> Day 3 · Night</span>
        </div>
      </div>
    </div>
  );
}

/* ============ "Stay tuned" marquee board with interactive bulbs ============ */
const TICKER = ["Stay tuned", "Follow for updates", "Esplendidez '27", "Department of Engineering & Technology - USTM"];
function UpdatesSign() {
  const [lit, setLit] = useState(false);
  const [bad, setBad] = useState(false);
  const root = useRef(null);
  useOffscreenPause(root);
  const COLORS = ["#9BB4FF", "#C4A3FF", "#F2A6D0"];
  const row = (n, off = 0) => Array.from({ length: n }, (_, i) => (
    <span key={i} className="bulb" style={{ "--c": COLORS[(i + off) % 3], animationDelay: `${(i % 6) * 0.25}s` }} />
  ));
  return (
    <div ref={root} className={`rounded-[2rem] transition-shadow duration-500 ${lit ? "shadow-[0_0_90px_-12px_rgba(164,150,255,0.6)]" : ""}`}>
      <div className="stub-notch rounded-[2rem] bg-gradient-to-br from-[#9BB4FF]/60 via-white/10 to-[#F2A6D0]/50 p-px">
        <div className={`${lit ? "lit " : ""}relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#0B0C12] px-6 py-16 text-center sm:px-16 sm:py-20`}>
          {!bad && <img src={CONFIG.signImage} alt="" onError={() => setBad(true)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${lit ? "opacity-60" : "opacity-35"}`} />}
          <div className="absolute inset-0 bg-gradient-to-br from-[#12152B]/85 via-[#0C0E14]/75 to-[#1B1228]/85" />
          <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(164,150,255,0.22),transparent_62%)] transition-opacity duration-700 ${lit ? "opacity-100" : "opacity-40"}`} />
          <div className="beam absolute -top-10 left-[12%] h-[140%] w-48 bg-gradient-to-b from-white/10 to-transparent blur-md" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
          <div className="beam absolute -top-10 right-[12%] h-[140%] w-48 bg-gradient-to-b from-[#F2A6D0]/15 to-transparent blur-md [animation-direction:alternate-reverse]" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-3 rounded-[calc(2rem-12px)] border border-white/10" />

          <div className="absolute inset-x-8 top-5 z-10 flex justify-between" onClick={() => setLit(!lit)} aria-hidden="true">{row(16)}</div>
          <div className="absolute inset-x-8 bottom-5 z-10 flex justify-between" onClick={() => setLit(!lit)} aria-hidden="true">{row(16, 1)}</div>

          <div className="relative z-10">
            <div className="-mx-6 overflow-hidden border-y border-white/10 bg-black/30 py-2 text-xs text-zinc-300 sm:-mx-16" aria-hidden="true">
              <div className="marq flex w-max gap-10 whitespace-nowrap">
                {[0, 1, 2, 3].map((k) => TICKER.map((t) => <span key={`${k}-${t}`} className="flex items-center gap-10">{t}<Sparkles size={12} className="text-[#C4A3FF]" /></span>))}
              </div>
            </div>
            <button onClick={() => setLit(!lit)} aria-pressed={lit} className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-400/60">
              <Lightbulb size={14} className={lit ? "text-[#F2A6D0]" : "text-zinc-400"} /> {lit ? "Lights on" : "Tap to switch the lights on"}
            </button>
            <h2 className="ez-grad mt-6 text-[clamp(2.4rem,10vw,5.5rem)] font-extrabold leading-none tracking-tight">STAY TUNED!</h2>
            <p className="mx-auto mt-5 max-w-md text-zinc-200">Follow our Instagram page for more updates like this.</p>
            <a href={`https://instagram.com/${OFFICIAL.insta}`} target="_blank" rel="noreferrer" className={`${btnGold} mt-8`}><Instagram size={16} /> Follow @{OFFICIAL.insta}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Logo: shows /public/ez-logo.png, falls back to an EZ monogram ============ */
function Logo({ className = "h-9", fallback = true }) {
  const [bad, setBad] = useState(false);
  if (bad) return fallback ? (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] text-sm font-bold text-[#0B0B1A]">EZ</span>
  ) : null;
  return <img src={CONFIG.logoSrc} alt="Esplendidez logo" onError={() => setBad(true)} className={`${className} w-auto shrink-0 object-contain`} />;
}

/* ============ Three.js particle wave: 30fps cap, skipped on weak devices, pauses offscreen / hidden tab ============ */
function ParticleWave() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const low = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (low) return; // weak devices keep the video smooth instead of running WebGL on top of it
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 4, 12);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    el.appendChild(renderer.domElement);
    const COLS = 48, ROWS = 28, SEP = 0.6;
    const pos = new Float32Array(COLS * ROWS * 3);
    let i = 0;
    for (let x = 0; x < COLS; x++) for (let z = 0; z < ROWS; z++) { pos[i++] = (x - COLS / 2) * SEP; pos[i++] = 0; pos[i++] = (z - ROWS / 2) * SEP; }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xA9B6FF, size: 0.05, transparent: true, opacity: 0.4, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => { m.tx = (e.clientX / window.innerWidth - 0.5) * 2; m.ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    window.addEventListener("pointermove", onMove, { passive: true });
    const resize = () => { const { clientWidth: w, clientHeight: h } = el; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); };
    resize(); window.addEventListener("resize", resize);
    let raf, visible = true, last = 0;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden || now - last < 33) return; // ~30fps
      last = now;
      const t = clock.getElapsedTime() * 0.45;
      const p = geo.attributes.position.array;
      let k = 1;
      for (let x = 0; x < COLS; x++) for (let z = 0; z < ROWS; z++) { p[k] = Math.sin(x * 0.3 + t) * 0.42 + Math.cos(z * 0.38 + t * 1.05) * 0.42; k += 3; }
      geo.attributes.position.needsUpdate = true;
      m.x += (m.tx - m.x) * 0.06; m.y += (m.ty - m.y) * 0.06;
      pts.rotation.y = m.x * 0.2; camera.position.y = 4 - m.y;
      camera.lookAt(0, 0, 0); renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      window.removeEventListener("pointermove", onMove); window.removeEventListener("resize", resize);
      geo.dispose(); mat.dispose(); renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  /* no mask-image here: masking a live WebGL canvas over a playing video causes video stutter */
  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
}

/* ============ Full-screen teaser with sound ============ */
function TeaserModal({ onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Teaser video">
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />
      <button onClick={onClose} aria-label="Close teaser" className="absolute right-5 top-5 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/50 hover:bg-white/10"><X size={20} /></button>
      <video src={CONFIG.videoSrc} controls autoPlay playsInline preload="auto" onLoadedMetadata={(e) => { e.currentTarget.volume = 1; }} className="relative max-h-[85vh] w-full max-w-5xl rounded-2xl border border-white/15 bg-black" />
    </div>
  );
}

/* ============ Events: category hub ============ */
const CAT = { Sports: ["#9BB4FF", "#C4A3FF"], Esports: ["#F2A6D0", "#C4A3FF"], Technical: ["#8FD3FF", "#9BB4FF"], Cultural: ["#C4A3FF", "#F2A6D0"], Literary: ["#8FD3FF", "#C4A3FF"] };
const CAT_ICON = { Sports: Dumbbell, Esports: Gamepad2, Technical: Cpu, Cultural: Music, Literary: Mic };
const CAT_TAG = { Sports: "Field, court and track", Esports: "Squads, screens and bragging rights", Technical: "Code, circuits and machines", Cultural: "Stage, style and spotlight", Literary: "Words, wit and quick minds" };
const EV_ICON = {
  Futsal: Target, "Unity Run": Footprints, Kabaddi: Users, "Tug of War": Flag, Badminton: Zap, Volleyball: Medal, "Table Tennis": Timer,
  "Arm Wrestling": Swords, "Power Lifting": Dumbbell, BGMI: Crosshair, "Mobile Legends": Swords, FIFA: Gamepad2,
  "Coding Competition": Code, "Model Making": Wrench, "Robot War": Bot, Debate: BookOpen, Quiz: Brain,
  "Dance Competition": Music, "Singing Competition": Mic, "Fashion Show": Shirt, Cosplay: Crown, "Prom Night": Star,
};
const CAT_LIST = CATEGORIES.slice(1);
const evIcon = (e) => EV_ICON[e.name] || CAT_ICON[e.cat];
const catEvents = (c) => EVENTS.filter((e) => e.cat === c);
const rupees = (str) => (String(str || "").match(/₹\s?[\d,]+/g) || []).map((m) => Number(m.replace(/[^\d]/g, "")));
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const topPrize = (c) => Math.max(0, ...catEvents(c).flatMap((e) => rupees(e.p1)));

function CategoryTile({ cat, big, onOpen }) {
  const list = catEvents(cat), [c1, c2] = CAT[cat], Icon = CAT_ICON[cat];
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    ref.current.style.setProperty("--cx", `${x}px`); ref.current.style.setProperty("--cy", `${y}px`);
    if (e.pointerType === "mouse") {
      ref.current.style.setProperty("--ry", `${(x / r.width - 0.5) * 6}deg`);
      ref.current.style.setProperty("--rx", `${-(y / r.height - 0.5) * 6}deg`);
    }
  };
  const leave = () => { ref.current.style.setProperty("--rx", "0deg"); ref.current.style.setProperty("--ry", "0deg"); };
  const shown = list.slice(0, big ? 7 : 4);
  return (
    <button ref={ref} onPointerMove={move} onPointerLeave={leave} onClick={onOpen} aria-label={`Open ${cat} events`}
      className="tilt group relative block h-full w-full rounded-3xl p-px text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C4A3FF]"
      style={{ background: `linear-gradient(135deg,${c1}99,rgba(255,255,255,0.08) 45%,${c2}88)` }}>
      <span className="relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0B0D13] p-7 sm:p-8">
        <span className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(ellipse at 100% 0%, ${c1}30, transparent 60%), radial-gradient(ellipse at 0% 100%, ${c2}22, transparent 55%)` }} />
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(260px circle at var(--cx,50%) var(--cy,50%), rgba(255,255,255,0.08), transparent 70%)" }} />
        <Icon aria-hidden="true" size={220} strokeWidth={0.6} className="pointer-events-none absolute -bottom-10 -right-10 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" style={{ color: c1, opacity: 0.12 }} />
        <span className="relative flex items-start justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/[0.05]" style={{ color: c1, boxShadow: `0 0 30px -8px ${c1}` }}><Icon size={26} /></span>
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-zinc-200">{list.length} events</span>
        </span>
        <span className={`relative mt-6 block pb-1 font-semibold tracking-tight ${silver} ${big ? "text-4xl sm:text-5xl" : "text-3xl"}`}>{cat}</span>
        <span className="relative mt-1 block text-sm text-zinc-400">{CAT_TAG[cat]}</span>
        <span className="relative mt-5 flex flex-wrap gap-2">
          {shown.map((e) => <span key={e.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300">{e.name}</span>)}
          {list.length > shown.length && <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">+{list.length - shown.length} more</span>}
        </span>
        <span className="relative mt-auto flex items-end justify-between pt-8">
          <span><span className="block text-xs text-zinc-400">Top prize up to</span><span className="ez-static text-2xl font-bold">{fmt(topPrize(cat))}</span></span>
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-white/20 text-white transition-colors duration-300 group-hover:text-[#0B0B1A]">
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg,${c1},${c2})` }} />
            <ArrowUpRight size={18} className="relative" />
          </span>
        </span>
      </span>
    </button>
  );
}

function EventBanner({ ev }) {
  const [bad, setBad] = useState(false);
  const [c1, c2] = CAT[ev.cat], Icon = evIcon(ev);
  return (
    <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-white/10" style={{ background: `linear-gradient(135deg, ${c1}33, #0D0F15 60%, ${c2}33)` }}>
      {bad ? <div className="grid h-full place-items-center" style={{ color: c1 }}><Icon size={44} strokeWidth={1.25} /></div>
        : <img src={ev.image} alt={ev.name} onError={() => setBad(true)} className="h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D13]/70 to-transparent" />
    </div>
  );
}

/* prizes as a podium: 1st in the centre and tallest (stacked 1st, 2nd, 3rd on phones) */
function Podium({ ev, c1, c2 }) {
  const list = [[1, "1st prize", ev.p1], [2, "2nd prize", ev.p2], [3, "3rd prize", ev.p3]].filter(([, , v]) => v);
  const col = { 1: "sm:col-start-2", 2: "sm:col-start-1", 3: "sm:col-start-3" };
  const h = { 1: "sm:min-h-[8.5rem]", 2: "sm:min-h-[7rem]", 3: "sm:min-h-[6rem]" };
  return (
    <dl className="podium mt-6 text-sm" style={{ "--n": list.length }}>
      {list.map(([r, k, v]) => (
        <div key={r} className={`flex flex-col justify-end rounded-2xl border p-4 sm:row-start-1 ${col[r]} ${h[r]} ${r === 1 ? "border-transparent text-[#0B0B1A]" : "border-white/10 bg-white/[0.03]"}`}
          style={r === 1 ? { background: `linear-gradient(135deg,${c1},${c2})`, boxShadow: `0 18px 40px -18px ${c1}` } : undefined}>
          <dt className={`flex items-center gap-1.5 ${r === 1 ? "text-[#0B0B1A]/70" : "text-zinc-400"}`}>{r === 1 ? <Crown size={14} /> : <Medal size={14} />}{k}</dt>
          <dd className={`mt-1 font-semibold ${r === 1 ? "" : "text-white"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function CategoryPanel({ cat, onCat, onClose }) {
  const [sel, setSel] = useState(null);
  const navRef = useRef(null);
  const list = catEvents(cat);
  const ev = list.find((e) => e.id === sel) || list[0];
  const [c1, c2] = CAT[cat], Icon = CAT_ICON[cat], EvIcon = evIcon(ev);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);
  const go = (c) => { setSel(null); onCat(c); };
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-hidden p-2 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`${cat} events`}>
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="pop relative flex h-[86dvh] w-full min-w-0 max-w-5xl flex-col rounded-3xl p-px shadow-2xl sm:h-[min(92vh,760px)]" style={{ background: `linear-gradient(135deg,${c1},#C4A3FF55,${c2})` }}>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0B0D13]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48" style={{ background: `radial-gradient(ellipse at 20% 0%, ${c1}30, transparent 70%)` }} />
          <div className="relative mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/25 sm:hidden" aria-hidden="true" />
          <div className="relative flex items-center gap-4 px-5 pt-3 sm:px-8 sm:pt-7">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/[0.05]" style={{ color: c1, boxShadow: `0 0 30px -8px ${c1}` }}><Icon size={22} /></span>
            <div className="min-w-0">
              <h3 className={`pb-0.5 text-2xl font-semibold sm:text-3xl ${silver}`}>{cat}</h3>
              <p className="text-xs leading-snug text-zinc-400 sm:text-sm">{list.length} events · {CAT_TAG[cat]}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-zinc-300 transition hover:bg-white/10 hover:text-white"><X size={18} /></button>
          </div>
          <div className="relative mt-4 flex max-w-full gap-2 overflow-x-auto px-5 pb-4 sm:px-8" role="tablist" aria-label="Event categories">
            {CAT_LIST.map((c) => {
              const I = CAT_ICON[c], on = c === cat;
              return (
                <button key={c} role="tab" aria-selected={on} onClick={() => go(c)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all duration-300 ${on ? "border-transparent font-medium text-[#0B0B1A]" : "border-white/15 text-zinc-300 hover:border-zinc-400/60"}`}
                  style={on ? { background: `linear-gradient(90deg,${c1},${c2})` } : undefined}><I size={14} />{c}</button>
              );
            })}
          </div>
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-contain border-t border-white/10 md:overflow-hidden md:grid md:grid-cols-[17rem_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
            <nav ref={navRef} className="relative flex max-w-full shrink-0 gap-2 overflow-x-auto border-b border-white/10 p-3 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:border-b-0 md:border-r md:p-4" aria-label={`${cat} events`}>
              {list.map((e) => {
                const I = evIcon(e), on = e.id === ev.id, top = Math.max(0, ...rupees(e.p1));
                return (
                  <button key={e.id} onClick={(evt) => { setSel(e.id); const n = navRef.current, b = evt.currentTarget; if (n) n.scrollTo({ left: b.offsetLeft - (n.clientWidth - b.offsetWidth) / 2, behavior: "smooth" }); }} aria-current={on} className={`flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-all duration-300 ${on ? "border-transparent text-white" : "border-white/10 text-zinc-300 hover:border-zinc-500/50"}`}
                    style={on ? { background: `linear-gradient(135deg,${c1}33,${c2}22)`, boxShadow: `inset 0 0 0 1px ${c1}88` } : undefined}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${c1}1f`, color: c1 }}><I size={16} /></span>
                    <span className="min-w-0">
                      <span className="block whitespace-nowrap text-sm font-medium md:whitespace-normal">{e.name}</span>
                      <span className="block whitespace-nowrap text-xs text-zinc-500">{top ? `Top prize ${fmt(top)}` : "Prizes soon"}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
            <div key={ev.id} className="reveal min-w-0 flex-1 p-5 sm:p-8 md:min-h-0 md:overflow-y-auto">
              <EventBanner ev={ev} />
              <div className="mt-6 flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${c1}1f`, color: c1 }}><EvIcon size={22} /></span>
                <div>
                  <h4 className="text-2xl font-semibold text-white sm:text-3xl">{ev.name}</h4>
                  {ev.note && <p className="mt-1 text-sm text-zinc-400">{ev.note}</p>}
                </div>
              </div>
              {ev.p1 ? <Podium ev={ev} c1={c1} c2={c2} />
                : <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">Prize details for this event will be announced soon.</p>}
              <p className="mt-6 text-sm leading-relaxed text-zinc-400">Rules, team size and entry details are shared at registration. Have a question? Message a coordinator on WhatsApp.</p>
              <div className="sticky bottom-0 -mx-5 mt-6 flex flex-col gap-3 border-t border-white/10 bg-[#0B0D13]/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:static sm:mx-0 sm:flex-row sm:border-0 sm:bg-transparent sm:p-0">
                <a {...regProps} className={`${btnGold} sm:flex-1`}>Register for {ev.name} <ArrowUpRight size={16} /></a>
                <a href={waLink(COORDINATORS[0].phone)} target="_blank" rel="noreferrer" className={btnGhost}><MessageCircle size={16} /> Ask on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Footer: stage lights, pointer spotlight, glowing watermark ============ */
const STARS = Array.from({ length: 22 }, (_, i) => ({
  l: (i * 37 + 11) % 100, t: (i * 53 + 7) % 78, d: (i % 9) * 0.45, s: 1 + (i % 3),
}));

function Footer({ onOpenCat }) {
  const ref = useRef(null);
  const raf = useRef(0);
  useOffscreenPause(ref);
  const move = (e) => {
    if (raf.current) return;
    const { clientX: x, clientY: y } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--fx", `${x - r.left}px`);
      ref.current.style.setProperty("--fy", `${y - r.top}px`);
    });
  };
  const socials = [
    { href: `https://instagram.com/${OFFICIAL.insta}`, label: "Instagram", el: <Instagram size={17} />, ext: true },
    { href: `mailto:${OFFICIAL.email}`, label: "Email", el: <Mail size={17} /> },
    { href: waLink(COORDINATORS[0].phone), label: "WhatsApp", el: <MessageCircle size={17} />, ext: true },
  ];

  return (
    <footer ref={ref} onPointerMove={move} className="relative mt-16 overflow-hidden pt-28">
      {/* light rail along the top edge, with a spark that travels across it */}
      <div className="absolute inset-x-0 top-0 h-px ft-rail" aria-hidden="true">
        <span className="ft-spark" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(196,163,255,0.28),transparent_70%)]" aria-hidden="true" />

      {/* base wash + stage beams hanging from the rail */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241A3D]/80 via-[#12152B]/35 to-transparent" aria-hidden="true" />
      <div className="beam pointer-events-none absolute -top-8 left-[10%] h-[70%] w-56 bg-gradient-to-b from-[#9BB4FF]/25 to-transparent blur-lg" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
      <div className="beam pointer-events-none absolute -top-8 left-1/2 h-[75%] w-64 -translate-x-1/2 bg-gradient-to-b from-white/15 to-transparent blur-lg [animation-direction:alternate-reverse]" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />
      <div className="beam pointer-events-none absolute -top-8 right-[10%] h-[70%] w-56 bg-gradient-to-b from-[#F2A6D0]/25 to-transparent blur-lg" style={{ clipPath: "polygon(42% 0,58% 0,100% 100%,0 100%)" }} aria-hidden="true" />

      {/* spotlight that follows the pointer */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: "radial-gradient(420px circle at var(--fx,50%) var(--fy,30%), rgba(164,150,255,0.13), transparent 70%)" }} aria-hidden="true" />

      {/* twinkling dust */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STARS.map((s, i) => (
          <span key={i} className="ft-twk absolute rounded-full bg-white" style={{ left: `${s.l}%`, top: `${s.t}%`, width: s.s, height: s.s, "--d": `${s.d}s`, boxShadow: "0 0 8px 1px rgba(196,163,255,0.8)" }} />
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* closing call to action */}
        <div className="rounded-[2rem] bg-gradient-to-r from-[#9BB4FF]/70 via-white/10 to-[#F2A6D0]/70 p-px shadow-[0_0_80px_-24px_rgba(196,163,255,0.7)]">
          <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-[calc(2rem-1px)] bg-[#0B0C12]/95 px-7 py-10 sm:px-12 sm:py-12 lg:flex-row lg:items-center">
            <div className="flowbg pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(120deg,#12152B,#2A1F4D 30%,#3A1F44 55%,#12152B 80%)" }} aria-hidden="true" />
            <div className="relative max-w-xl">
              <h3 className="ez-grad pb-1 text-3xl font-bold leading-tight sm:text-5xl">The stage is set. Your team is next.</h3>
              <p className="mt-3 text-zinc-300">Pick an event, register your team and walk into three days of sport, technology and culture.</p>
            </div>
            <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a {...regProps} className={btnGold}>Register now <ArrowUpRight size={16} /></a>
              <a href={waLink(COORDINATORS[0].phone)} target="_blank" rel="noreferrer" className={btnGhost}><MessageCircle size={16} /> Ask a coordinator</a>
            </div>
          </div>
        </div>

        {/* link columns */}
        <div className="mt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <Logo className="h-14" fallback={false} />
              <p className="ez-static text-2xl font-extrabold tracking-wide">ESPLENDIDEZ '27</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">{CONFIG.tagline}</p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} {...(s.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group relative grid h-11 w-11 place-items-center rounded-full border border-white/15 text-zinc-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#C4A3FF]/70 hover:text-white hover:shadow-[0_0_28px_-4px_rgba(196,163,255,0.8)]">
                  {s.el}
                </a>
              ))}
            </div>
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n}>
                  <a href={`#${n.toLowerCase()}`} className="ft-link inline-flex items-center gap-2 text-zinc-400 transition-colors hover:text-white">{n}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="text-sm font-semibold text-white">Arenas</p>
            <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {CAT_LIST.map((c) => {
                const I = CAT_ICON[c], [c1] = CAT[c];
                return (
                  <li key={c}>
                    <button onClick={() => onOpenCat(c)} className="group flex w-full items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:text-white" style={{ "--c": c1 }}>
                      <span className="grid h-7 w-7 place-items-center rounded-lg transition-shadow duration-300 group-hover:shadow-[0_0_16px_-2px_var(--c)]" style={{ background: `${c1}1f`, color: c1 }}><I size={14} /></span>
                      {c}
                      <span className="ml-auto text-xs text-zinc-500">{catEvents(c).length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* giant watermark: outlined by default, lit up under the pointer */}
      <div className="relative mt-20 select-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]" aria-hidden="true">
        <div className="relative whitespace-nowrap text-center text-[11.4vw] font-extrabold leading-[0.9] tracking-tighter">
          <span className="block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.14)", color: "transparent" }}>ESPLENDIDEZ</span>
          <span className="ez-grad absolute inset-0 block ft-wm" style={{ WebkitMaskImage: "radial-gradient(480px circle at var(--fx,50%) 55%, #000 0%, transparent 70%)", maskImage: "radial-gradient(480px circle at var(--fx,50%) 55%, #000 0%, transparent 70%)" }}>ESPLENDIDEZ</span>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-zinc-500 md:flex-row">
          <p className="text-center md:text-left">© 2027 Esplendidez, Engineering Department, University of Science &amp; Technology Meghalaya</p>
          <p className="inline-flex flex-wrap items-center justify-center gap-x-1.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-zinc-400">
            Designed and developed by
            <a href="https://himankashyap.vercel.app" target="_blank" rel="noreferrer" className="ez-static font-semibold underline decoration-white/20 underline-offset-4 transition hover:decoration-[#C4A3FF]">Himan Kashyap</a>
          </p>
          <a href="#home" aria-label="Back to top" className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C4A3FF]/70 hover:text-white hover:shadow-[0_0_28px_-6px_rgba(196,163,255,0.8)]">
            Back to top <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ============ App ============ */
export default function App() {
  const [openCat, setOpenCat] = useState(null);
  const [menu, setMenu] = useState(false);
  const [day, setDay] = useState(0);
  const groups = useMemo(() => SCHEDULE[day].items.reduce((acc, it) => {
    const last = acc[acc.length - 1];
    if (last && last.slot === it[0]) last.items.push(it); else acc.push({ slot: it[0], items: [it] });
    return acc;
  }, []), [day]);
  const bgRef = useRef(null);
  const progRef = useRef(null);
  const onHeroMove = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", String(x * 100)); el.style.setProperty("--py", String(y * 100));
    el.style.setProperty("--mx", String((x - 0.5) * 2)); el.style.setProperty("--my", String((y - 0.5) * 2));
  };
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [vFail, setVFail] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const toggleMute = () => {
    const v = bgRef.current; if (!v) return;
    const next = !v.muted;
    v.muted = next;
    if (!next) { v.volume = 1; v.play().catch(() => { }); setPlaying(true); }
    setMuted(next);
  };
  const togglePlay = () => {
    const v = bgRef.current; if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };
  // pause the background loop while the full teaser is open
  useEffect(() => {
    const v = bgRef.current; if (!v) return;
    if (teaser) v.pause(); else if (playing) v.play().catch(() => { });
  }, [teaser]); // eslint-disable-line

  // scroll progress bar
  useEffect(() => {
    const on = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) progRef.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    window.addEventListener("scroll", on, { passive: true }); on();
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
    const style = document.createElement("style");
    style.textContent = `html{scroll-behavior:smooth;scroll-padding-top:96px}body{margin:0;background:#07080A}
      .ez-grad{background:linear-gradient(100deg,#fff 0%,#9BB4FF 25%,#C4A3FF 50%,#F2A6D0 75%,#fff 100%);background-size:260% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ezflow 9s ease-in-out infinite alternate}
      @keyframes ezflow{to{background-position:100% 0}}
      .bulb{width:8px;height:8px;border-radius:9999px;background:var(--c);opacity:.3;cursor:pointer;transition:transform .2s,opacity .2s;animation:bulb 2.6s ease-in-out infinite}
      @media (min-width:640px){.bulb{width:10px;height:10px}}
      .bulb:hover{transform:scale(1.8);opacity:1;box-shadow:0 0 12px 3px var(--c)}
      .lit .bulb{animation:none;opacity:1;box-shadow:0 0 10px 2px var(--c)}
      .lit h2{filter:drop-shadow(0 0 16px rgba(196,163,255,.45))}
      @keyframes bulb{0%,100%{opacity:.3;box-shadow:none}50%{opacity:1;box-shadow:0 0 10px 2px var(--c)}}
      .stub-notch{-webkit-mask:radial-gradient(circle 18px at 0 50%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 18px at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat;mask:radial-gradient(circle 18px at 0 50%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 18px at 100% 50%,#0000 98%,#000) right/51% 100% no-repeat}
      .beam{transform-origin:top center;animation:sway 7s ease-in-out infinite alternate}@keyframes sway{from{transform:rotate(-16deg)}to{transform:rotate(16deg)}}
      .eq{width:4px;height:60%;border-radius:2px;background:linear-gradient(#9BB4FF,#F2A6D0);animation:eq 1.1s ease-in-out infinite}@keyframes eq{0%,100%{height:20%}50%{height:100%}}
      .marq{animation:marq 30s linear infinite}@keyframes marq{to{transform:translateX(-50%)}}
      .float{animation:floaty var(--dur,7s) ease-in-out var(--del,0s) infinite alternate}@keyframes floaty{from{transform:translateY(-8px) rotate(-4deg)}to{transform:translateY(10px) rotate(4deg)}}
      .rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}@keyframes rise{from{opacity:0;transform:translateY(24px)}}
      .rv{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.2,.7,.2,1) var(--d,0s),transform .8s cubic-bezier(.2,.7,.2,1) var(--d,0s)}.rv.in{opacity:1;transform:none}
      .travel{left:0;animation:travel 4.5s ease-in-out infinite alternate}@keyframes travel{to{left:calc(100% - 10px)}}
      .flowbg{background-size:300% 300%;animation:flowbg 14s ease infinite}@keyframes flowbg{50%{background-position:100% 50%}}
      .pop{animation:pop .35s cubic-bezier(.2,.7,.2,1) both}@keyframes pop{from{opacity:0;transform:translateY(16px) scale(.98)}}
      .reveal{animation:rv .5s ease both}@keyframes rv{from{opacity:0;transform:translateY(10px)}}
      .ft-rail{background:linear-gradient(90deg,transparent,#9BB4FF 20%,#C4A3FF 50%,#F2A6D0 80%,transparent);box-shadow:0 0 18px 1px rgba(196,163,255,.55)}
      .ft-spark{position:absolute;top:-3px;left:0;width:140px;height:7px;border-radius:9999px;background:radial-gradient(closest-side,#fff,rgba(196,163,255,.6) 50%,transparent);animation:ftspark 7s ease-in-out infinite alternate}
      @keyframes ftspark{to{left:calc(100% - 140px)}}
      .ft-twk{opacity:.1;animation:fttwk 3.6s ease-in-out var(--d,0s) infinite}
      @keyframes fttwk{0%,100%{opacity:.08;transform:scale(.8)}50%{opacity:.9;transform:scale(1.4)}}
      .ft-link{position:relative}
      .ft-link::before{content:"";width:0;height:1px;background:linear-gradient(90deg,#9BB4FF,#F2A6D0);transition:width .3s ease}
      .ft-link:hover::before{width:14px}
      .ft-wm{opacity:.95}
      ::selection{background:#C4A3FF55;color:#fff}
      html{scrollbar-width:thin;scrollbar-color:#6a5fb5 #07080A}
      ::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:#07080A}
      ::-webkit-scrollbar-thumb{background:linear-gradient(#9BB4FF,#C4A3FF,#F2A6D0);border-radius:9999px;border:2px solid #07080A}
      .ez-static{background:linear-gradient(100deg,#fff,#9BB4FF 35%,#C4A3FF 65%,#F2A6D0);-webkit-background-clip:text;background-clip:text;color:transparent}
      .beam,.ft-spark,.float,.marq{will-change:transform}
      .cv{content-visibility:auto;contain-intrinsic-size:auto 900px}
      [data-off="1"] *{animation-play-state:paused!important}
      .tilt{transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .35s cubic-bezier(.2,.7,.2,1);will-change:transform}
      .podium{display:grid;gap:.75rem}
      @media (min-width:640px){.podium{grid-template-columns:repeat(var(--n),minmax(0,1fr));align-items:end}}
      .rise-i{animation:rv .5s ease both;animation-delay:calc(var(--i,0)*70ms)}
      @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.ez-grad,.bulb,.reveal,.beam,.eq,.marq,.float,.rise,.rise-i,.travel,.flowbg,.pop,.ft-spark,.ft-twk{animation:none}.rv{opacity:1;transform:none;transition:none}.bulb{opacity:.8}.tilt{transform:none}}`;
    document.head.append(link, style);
    return () => { link.remove(); style.remove(); };
  }, []);

  const section = "mx-auto w-full max-w-6xl px-6 py-24";

  return (
    <div className="min-h-screen text-zinc-300 antialiased"
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "radial-gradient(900px 500px at 15% -5%, rgba(143,156,255,0.09), transparent 60%), radial-gradient(800px 500px at 100% 30%, rgba(242,166,208,0.05), transparent 60%), linear-gradient(#07080A, #0D0F14 60%, #07080A)"
      }}>

      <div ref={progRef} className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0]" style={{ transform: "scaleX(0)" }} aria-hidden="true" />

      {/* Navbar: 3-column grid keeps the links truly centred */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
        <nav className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-full border border-white/10 bg-[#07080A]/80 py-2 pl-3 pr-2 shadow-lg shadow-black/40 backdrop-blur-md sm:px-5 sm:py-2.5 md:grid-cols-[1fr_auto_1fr]" aria-label="Main">
          <a href="#home" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Logo className="h-9" />
            <span className="flex min-w-0 flex-col leading-none">
              <span className="ez-static truncate text-[15px] font-bold tracking-wide sm:text-lg">ESPLENDIDEZ '27</span>
              <span className="ez-static mt-1 truncate pb-0.5 text-[8.5px] font-medium tracking-wide sm:text-[9px]">
                <span className="sm:hidden">Engineering &amp; Technology · USTM</span>
                <span className="hidden sm:inline">Department of Engineering &amp; Technology - USTM</span>
              </span>
            </span>
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <li key={n}><a href={`#${n.toLowerCase()}`} className="rounded-full px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">{n}</a></li>
            ))}
          </ul>
          <div className="flex items-center justify-end gap-2">
            <ThemeToggle />
            <a {...regProps} className={`${btnGold} !px-5 !py-2 max-sm:hidden`}>Register <ArrowUpRight size={14} /></a>
            <button className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 md:hidden" onClick={() => setMenu(!menu)} aria-label="Toggle menu" aria-expanded={menu}>
              {menu ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
        <div className={`mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-[#07080A]/95 transition-all duration-300 md:hidden ${menu ? "mt-2 max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0"}`}>
          <ul className="p-3">
            {NAV.map((n) => <li key={n}><a href={`#${n.toLowerCase()}`} onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-white hover:bg-white/5">{n}</a></li>)}
          </ul>
          <div className="p-3 pt-0"><a {...regProps} className={`${btnGold} w-full`}>Register now</a></div>
        </div>
      </header>

      {/* Hero: video fills the first screen, then fades into the page */}
      <Hero
        videoSrc={CONFIG.videoSrc}
        tagline={CONFIG.tagline}
        logo={<Logo className="h-14 sm:h-16" fallback={false} />}
        words={CAT_LIST}
        paused={teaser}
        onTeaser={() => setTeaser(true)}
        wave={!teaser && <ParticleWave />}
      />

      {/* Stats */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-6 py-8 md:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon size={16} className="text-[#A9B6FF]" />
              <span className={`text-2xl font-semibold ${silver}`}><CountUp value={value} /></span>
              <span className="text-sm text-zinc-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <section id="events" className={`${section} relative isolate`}>
        <SectionGlow />
        <SectionHead n="01" title="Events" sub={`${EVENTS.length} events across ${CAT_LIST.length} arenas. Open an arena to explore its events and register.`} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {CAT_LIST.map((c, i) => (
            <Reveal key={c} delay={i * 0.08} className={`h-full ${c === "Sports" ? "sm:col-span-2 lg:col-span-4" : "lg:col-span-2"}`}>
              <CategoryTile cat={c} big={c === "Sports"} onOpen={() => setOpenCat(c)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Stay tuned */}
      <section id="updates" className={`${section} relative isolate`}>
        <SectionGlow c1="196,163,255" c2="155,180,255" side="right" />
        <Reveal><UpdatesSign /></Reveal>
      </section>

      {/* Schedule */}
      <section id="schedule" className={`${section} cv relative isolate`}>
        <SectionGlow c1="143,211,255" c2="196,163,255" side="right" />
        <SectionHead n="02" title="Schedule" />
        <p className="mt-3 text-sm text-zinc-400">Timings are tentative and confirmed with registered teams.</p>
        <div className="mt-8 grid grid-cols-3 gap-3" role="tablist">
          {SCHEDULE.map((d, i) => (
            <button key={d.day} role="tab" aria-selected={day === i} onClick={() => setDay(i)}
              className={`rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${day === i ? "border-[#A9B6FF]/60 bg-gradient-to-br from-[#9BB4FF]/15 to-[#F2A6D0]/10" : "border-white/10 hover:border-zinc-500/50"}`}>
              <span className={`block text-xl font-semibold ${day === i ? silver : "text-zinc-300"}`}>{d.day}</span>
              <span className="mt-1 block text-xs text-zinc-400">{d.theme}</span>
              <span className="mt-2 hidden text-xs text-zinc-500 sm:block">{d.items.length} sessions</span>
            </button>
          ))}
        </div>

        <div key={day} className="reveal relative mt-12">
          <div className="absolute bottom-0 left-[22px] top-2 w-px bg-gradient-to-b from-[#8FD3FF] via-[#B4A4FF] to-[#9A7CFF]" aria-hidden="true" />
          {groups.map((g) => {
            const [SlotIcon, color] = SLOTS[g.slot];
            return (
              <div key={g.slot} className="relative pb-10 pl-16 last:pb-0">
                <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#0B0D12]" style={{ color, boxShadow: `0 0 0 5px ${color}1f` }}>
                  <SlotIcon size={18} />
                </span>
                <p className="pt-2.5 text-sm font-semibold" style={{ color }}>{g.slot}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {g.items.map(([, label, Icon, hl], idx) => hl === "headliner" ? <Headliner key={label} /> : (
                    <div key={label} style={{ "--i": idx }} className={`rise-i flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${hl ? "border-[#C4A3FF]/50 bg-gradient-to-r from-[#9BB4FF]/10 to-[#F2A6D0]/10" : "border-white/10 bg-white/[0.035] hover:border-zinc-500/50"}`}>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1f`, color }}><Icon size={18} /></span>
                      <span className="text-white">{label}</span>
                      {hl && <span className="ml-auto shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-zinc-300">Highlight</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className={`${section} relative isolate cv`}>
        <SectionGlow c1="242,166,208" c2="155,180,255" />
        <FloatIcons items={[
          { Icon: Star, pos: "right-[4%] top-16", depth: 0, dur: 8 },
          { Icon: Sparkles, pos: "left-[2%] bottom-28", depth: 0, dur: 7, del: 1 },
        ]} />
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-4xl leading-[1.12] tracking-tight sm:text-6xl">
                <span className="block font-light text-zinc-300">The baton passes to</span>
                <span className={`block pb-1 font-bold ${silver}`}>USTM's first engineering batch.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 max-w-xl space-y-5 text-lg font-light leading-relaxed text-zinc-300">
                <p>Esplendidez began in 2011 and, through 2026, was organised by the Engineering Department of RIST. Those years made it a place where students compete on real problems in code, hardware and design.</p>
                <p>In 2027 the fest begins a new chapter at the University of Science & Technology Meghalaya. It is organised by USTM's first engineering batch, who inherit the spirit of the fest and are building the rest themselves.</p>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <div className="space-y-4">
                <div className={`${card} p-6`}>
                  <p className="text-3xl font-bold text-zinc-200">2011–2026</p>
                  <p className="mt-1 text-lg font-medium text-white">RIST</p>
                  <p className="mt-2 text-sm text-zinc-400">Esplendidez, organised by the Engineering Department of RIST.</p>
                </div>
                <div className="ml-8 flex items-center gap-3" aria-hidden="true"><span className="h-10 w-px bg-gradient-to-b from-[#9BB4FF] to-[#F2A6D0]" /><Sparkles size={14} className="text-[#C4A3FF]" /></div>
                <div className="rounded-2xl bg-gradient-to-br from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] p-px shadow-[0_0_50px_-18px_rgba(196,163,255,0.6)]">
                  <div className="rounded-[calc(1rem-1px)] bg-[#0C0E14] p-6">
                    <p className="ez-static text-4xl font-extrabold">2027</p>
                    <p className="mt-1 text-lg font-medium text-white">USTM</p>
                    <p className="mt-2 text-sm text-zinc-300">Esplendidez, organised by the first engineering batch of USTM.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal delay={0.1}>
          <div className="mt-20 rounded-[2rem] bg-gradient-to-r from-[#9BB4FF]/60 via-white/10 to-[#F2A6D0]/60 p-px">
            <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-[#0B0C12] px-6 py-16 text-center sm:px-14 sm:py-24">
              <div className="flowbg absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(120deg,#12152B,#2A1F4D 30%,#3A1F44 55%,#12152B 80%)" }} aria-hidden="true" />
              <span className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 select-none text-[9rem] font-extrabold leading-none lg:block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.09)", color: "transparent" }} aria-hidden="true">2011</span>
              <span className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none text-[9rem] font-extrabold leading-none lg:block" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.09)", color: "transparent" }} aria-hidden="true">2027</span>
              <div className="relative">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-[#C4A3FF] shadow-[0_0_40px_-8px_rgba(196,163,255,0.7)]"><Flame size={22} /></span>
                <blockquote className="mx-auto mt-8 max-w-3xl">
                  <p className="ez-grad pb-1 text-3xl font-semibold leading-snug sm:text-5xl">{CONFIG.tagline}</p>
                </blockquote>
                <div className="mx-auto mt-10 flex max-w-sm items-center gap-4 text-sm text-zinc-400">
                  <span>2011</span>
                  <span className="relative h-px flex-1 bg-gradient-to-r from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0]" aria-hidden="true"><span className="travel absolute -top-1 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_14px_3px_rgba(196,163,255,0.8)]" /></span>
                  <span>2027</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section id="contact" className={`${section} cv relative isolate`}>
        <SectionGlow c1="196,163,255" c2="143,211,255" side="right" />
        <SectionHead n="03" title="Contact" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <a href={`mailto:${OFFICIAL.email}`} className={`${card} flex items-center gap-4 p-5`}><span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#9BB4FF]/25 to-[#F2A6D0]/25 text-[#C4A3FF]"><Mail size={20} /></span><div><p className="text-xs text-zinc-400">Official email</p><p className="text-white">{OFFICIAL.email}</p></div></a>
          <a href={`https://instagram.com/${OFFICIAL.insta}`} target="_blank" rel="noreferrer" className={`${card} flex items-center gap-4 p-5`}><span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#9BB4FF]/25 to-[#F2A6D0]/25 text-[#C4A3FF]"><Instagram size={20} /></span><div><p className="text-xs text-zinc-400">Instagram</p><p className="text-white">@{OFFICIAL.insta}</p></div></a>
        </div>
        <h3 className="mt-14 text-2xl font-semibold text-white">Student coordinators</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {COORDINATORS.map((c) => (
            <div key={c.name} className={`${card} relative flex flex-col overflow-hidden p-6`}>
              <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C4A3FF] to-transparent" />
              <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] font-semibold text-[#0B0B1A]">{c.name.split(" ").map((w) => w[0]).join("")}</span>
              <p className="text-lg font-semibold text-white">{c.name}</p>
              <p className="text-sm text-[#A9B6FF]">{c.role}</p>
              {(c.email || c.insta) && (
                <div className="mt-4 space-y-2 text-sm text-zinc-300">
                  {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 hover:text-white"><Mail size={15} className="text-zinc-500" />{c.email}</a>}
                  {c.insta && <a href={`https://instagram.com/${c.insta}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white"><span className="text-zinc-500"><Instagram size={15} /></span>@{c.insta}</a>}
                </div>
              )}
              <a href={waLink(c.phone)} target="_blank" rel="noreferrer" className={`${btnGold} mt-6`}><MessageCircle size={16} /> Message on WhatsApp</a>
            </div>
          ))}
        </div>
      </section>

      <Footer onOpenCat={setOpenCat} />

      {teaser && <TeaserModal onClose={() => setTeaser(false)} />}
      {openCat && <CategoryPanel cat={openCat} onCat={setOpenCat} onClose={() => setOpenCat(null)} />}
    </div>
  );
}