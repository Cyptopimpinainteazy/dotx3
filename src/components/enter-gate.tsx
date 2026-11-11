import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { BLAST_URL, SONG } from "@/lib/song";

/**
 * Full-screen enter page shown once per browser session on the home page. Plays the
 * dotx3 track muted (browsers block sound until a tap), and offers two ways in: the site,
 * or MEME COIN BLAST. Escape or "Enter dotx3" dismisses it; deep links never see it.
 */

const FALLBACK_LOOP = "/media/hero.mp4";
const SEEN_KEY = "dotx3-entered-v1";

function alreadyEntered(): boolean {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberEntered() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the gate simply shows again next visit */
  }
}

/** The game's URL, keeping a path-based preview host's `/hds-…/` prefix. */
function blastHref(): string {
  if (typeof window === "undefined") return BLAST_URL;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return prefix ? `${prefix}${BLAST_URL}` : BLAST_URL;
}

export function EnterGate() {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState(BLAST_URL);
  const rootRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setHref(blastHref());
    if (!alreadyEntered()) setOpen(true);
  }, []);

  const enter = useCallback(() => {
    rememberEntered();
    videoRef.current?.pause();
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    enterRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Everything behind the gate is inert, so Tab and Shift+Tab stay inside the dialog and
    // screen readers see only the gate.
    const behind = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== rootRef.current && !el.hasAttribute("inert"),
    );
    behind.forEach((el) => el.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      behind.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open, enter]);

  function toggleSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) {
      v.currentTime = v.currentTime > 1 ? v.currentTime : 0;
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
      });
    }
  }

  if (!open) return null;
  const hasSong = SONG.video !== null;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Enter dotx3"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-bg"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-60"
        src={SONG.video ?? FALLBACK_LOOP}
        poster={SONG.poster}
        autoPlay
        muted
        loop={!hasSong}
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/20 to-bg/90" />

      <div className="relative z-10 mx-4 max-w-2xl text-center">
        <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">dotx3 · NEAR Intents</p>
        <h1 className="mt-4 font-display text-6xl text-fg sm:text-8xl">
          <span className="text-primary">.</span>x3
        </h1>
        <p className="mt-4 text-lg text-fg/90">The agent proposes. Your .x3 orders decide. The chain proves it.</p>
        {hasSong ? <p className="mt-2 text-sm text-muted">Now playing: {SONG.title}</p> : null}

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            ref={enterRef}
            type="button"
            onClick={enter}
            className="tap min-h-12 w-full rounded-full bg-primary px-8 text-base font-semibold text-bg sm:w-auto"
          >
            Enter dotx3
          </button>
          <a
            href={href}
            onClick={rememberEntered}
            className="tap inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent px-8 text-base font-semibold text-accent sm:w-auto"
          >
            Play MEME COIN BLAST
          </a>
        </div>

        {hasSong ? (
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className="tap mt-5 min-h-11 rounded-full border border-border px-5 text-sm text-fg"
          >
            {muted ? "Tap for sound" : "Mute"}
          </button>
        ) : null}
        <p className="mt-6 text-xs text-muted">MEME COIN BLAST uses real NEAR Intents token names and live prices with play credits only. No wallet, no real money.</p>
      </div>
    </div>,
    document.body,
  );
}
