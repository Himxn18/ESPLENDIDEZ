import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

/* Light theme = the whole page colour-inverted (hues kept), with photos, video and canvases flipped back
   so they keep their real colours. Dark stays the default and the choice is remembered. */
const KEY = "ez-theme";
const CSS = `html{transition:filter .5s ease}
html[data-theme="light"]{filter:invert(1) hue-rotate(180deg)}
html[data-theme="light"] img,html[data-theme="light"] video,html[data-theme="light"] canvas{filter:invert(1) hue-rotate(180deg)}
@media (prefers-reduced-motion:reduce){html{transition:none}}`;

export default function ThemeToggle() {
    const [light, setLight] = useState(() => { try { return localStorage.getItem(KEY) === "light"; } catch (e) { return false; } });

    useEffect(() => {
        if (document.getElementById("ez-theme-style")) return;
        const s = document.createElement("style"); s.id = "ez-theme-style"; s.textContent = CSS; document.head.appendChild(s);
    }, []);
    useEffect(() => {
        document.documentElement.dataset.theme = light ? "light" : "dark";
        try { localStorage.setItem(KEY, light ? "light" : "dark"); } catch (e) { /* ignore */ }
    }, [light]);

    const flip = () => setLight((v) => !v);
    const label = light ? "Switch to dark theme" : "Switch to light theme";
    return (
        <>
            {/* phones: compact round button */}
            <button type="button" onClick={flip} aria-label={label} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-[#C4A3FF] transition hover:border-[#C4A3FF]/60 sm:hidden">
                {light ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {/* larger screens: sliding switch */}
            <button type="button" role="switch" aria-checked={light} onClick={flip} aria-label={label} className="relative hidden h-9 w-[4.25rem] shrink-0 rounded-full border border-white/15 bg-white/[0.06] p-1 backdrop-blur-md transition hover:border-[#C4A3FF]/60 sm:block">
                <Moon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <Sun size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <span className="relative grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#9BB4FF] via-[#C4A3FF] to-[#F2A6D0] text-[#0B0B1A] shadow-[0_0_14px_-2px_rgba(196,163,255,0.8)] transition-transform duration-300 ease-out" style={{ transform: light ? "translateX(30px)" : "translateX(0)" }}>
                    {light ? <Sun size={14} /> : <Moon size={14} />}
                </span>
            </button>
        </>
    );
}