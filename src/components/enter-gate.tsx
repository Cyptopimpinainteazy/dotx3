import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { previewPathPrefix } from "@/lib/preview-path-prefix";
import { BLAST_URL, INTRO_EVENT, SONG } from "@/lib/song";

/**
 * Full-screen intro shown once per browser session on the home page, and again whenever
 * someone presses "Watch the intro". The "Who Gets Paid" video starts muted, because
 * browsers block sound until a tap; "Play with sound" restarts it from the top so the music
 * comes in with the picture. Leaving fades the song out instead of cutting it. Escape or
 * "Enter dotx3" dismisses it; deep links never see it.
 */

const FALLBACK_LOOP = "/media/hero.mp4";
const SEEN_KEY = "dotx3-entered-v1";
const FADE_MS = 600;

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

/** Data saver or reduced motion: show the poster and let the visitor start the video. */
function prefersStill(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData) || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The game's URL, keeping a path-based preview host's `/hds-…/` prefix. */
function blastHref(): string {
  if (typeof window === "undefined") return BLAST_URL;
  const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
  return prefix ? `${prefix}${BLAST_URL}` : BLAST_URL;
}

function clock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function EnterGate() {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState(BLAST_URL);
  const [muted, setMuted] = useState(true);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState({ at: 0, length: 0 });
  const [leaving, setLeaving] = useState(false);
  /** Sound has been on during this opening, so muting offers "sound back on", not a restart. */
  const [heard, setHeard] = useState(false);
  const leavingRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundRef = useRef<HTMLButtonElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const fadeTimer = useRef<number | null>(null);

  const hasSong = SONG.video !== null && !failed;

  /** Start the song from the top with sound. Falls back to muted if the browser refuses. */
  const playWithSound = useCallback(() => {
    const v = videoRef.current;
    if (!v || v.currentSrc.endsWith(FALLBACK_LOOP)) return;
    v.currentTime = 0;
    v.volume = 1;
    v.muted = false;
    setMuted(false);
    setEnded(false);
    setHeard(true);
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      setHeard(false);
      v.play().catch(() => undefined);
    });
    // The sound button is replaced by Mute, so hand focus to the primary action.
    window.requestAnimationFrame(() => enterRef.current?.focus());
  }, []);

  useEffect(() => {
    setHref(blastHref());
    setStill(prefersStill());
    if (!alreadyEntered()) setOpen(true);
    const reopen = (e: Event) => {
      const withSound = Boolean((e as CustomEvent<{ withSound?: boolean }>).detail?.withSound);
      // Render the gate synchronously so play() still runs inside the visitor's click, which
      // is what browsers require before they allow sound.
      flushSync(() => {
        setFailed(false);
        setEnded(false);
        setHeard(false);
        setLeaving(false);
        setProgress({ at: 0, length: 0 });
        setOpen(true);
      });
      if (withSound) playWithSound();
    };
    window.addEventListener(INTRO_EVENT, reopen);
    return () => {
      window.removeEventListener(INTRO_EVENT, reopen);
      if (fadeTimer.current !== null) window.clearInterval(fadeTimer.current);
    };
  }, [playWithSound]);

  const enter = useCallback(() => {
    // A second Enter or Escape during the fade must not start another timer.
    if (leavingRef.current) return;
    rememberEntered();
    const v = videoRef.current;
    if (!v || v.muted || v.paused) {
      v?.pause();
      setOpen(false);
      return;
    }
    // Fade the song out rather than cutting it mid-line.
    leavingRef.current = true;
    setLeaving(true);
    const start = v.volume;
    const began = performance.now();
    fadeTimer.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - began) / FADE_MS);
      v.volume = start * (1 - t);
      if (t >= 1) {
        if (fadeTimer.current !== null) window.clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        v.pause();
        leavingRef.current = false;
        setOpen(false);
        setLeaving(false);
      }
    }, 30);
  }, []);

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (hasSong && muted ? soundRef.current : enterRef.current)?.focus();
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
      if (returnTo?.isConnected) returnTo.focus();
    };
    // Focus is chosen once per opening; later mute changes must not steal it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, enter, hasSong]);

  function mute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    setMuted(true);
    // Mute is replaced by the sound button; keep keyboard focus on it.
    window.requestAnimationFrame(() => soundRef.current?.focus());
  }

  /** Sound back on where the song is, rather than restarting it. */
  function unmute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
    });
    window.requestAnimationFrame(() => enterRef.current?.focus());
  }

  if (!open) return null;
  const left = progress.length > 0 ? progress.length - progress.at : 0;
  const pct = progress.length > 0 ? (progress.at / progress.length) * 100 : 0;
  const soundOn = hasSong && !muted && !ended;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Enter dotx3"
      className={`fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-bg py-10 transition-opacity duration-500 motion-reduce:transition-none sm:items-center ${leaving ? "opacity-0" : "opacity-100"}`}
    >
      <video
        key={hasSong ? "song" : "loop"}
        ref={videoRef}
        className={`fixed inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${soundOn ? "opacity-80" : "opacity-50"}`}
        poster={hasSong ? SONG.poster : "/media/logo.jpg"}
        autoPlay={!still}
        muted
        loop={!hasSong}
        playsInline
        preload={still ? "metadata" : "auto"}
        aria-hidden="true"
        onLoadedMetadata={(e) => setProgress({ at: 0, length: e.currentTarget.duration || 0 })}
        onTimeUpdate={(e) =>
          setProgress({ at: e.currentTarget.currentTime, length: e.currentTarget.duration || 0 })
        }
        onEnded={() => setEnded(true)}
      >
        {hasSong ? (
          <>
            {SONG.webm !== null && <source src={SONG.webm} type='video/webm; codecs="vp9,opus"' />}
            {/* With <source> children the error lands on the last source, not on <video>. */}
            <source src={SONG.video ?? FALLBACK_LOOP} type="video/mp4" onError={() => setFailed(true)} />
          </>
        ) : (
          <source src={FALLBACK_LOOP} type="video/mp4" />
        )}
      </video>
      <div
        className={`fixed inset-0 bg-gradient-to-b transition-opacity duration-700 motion-reduce:transition-none ${soundOn ? "from-bg/10 via-transparent to-bg/95" : "from-bg/40 via-bg/20 to-bg/90"}`}
      />

      <div className="relative z-10 mx-4 flex min-h-full max-w-2xl flex-col justify-center text-center">
        <div className={`transition-all duration-700 motion-reduce:transition-none ${soundOn ? "sm:translate-y-[28vh]" : ""}`}>
          <p className="font-display text-xs tracking-[0.3em] text-accent uppercase">dotx3 · NEAR Intents</p>
          <h1
            className={`mt-4 font-display text-fg drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] transition-all duration-700 motion-reduce:transition-none ${soundOn ? "text-5xl sm:text-6xl" : "text-6xl sm:text-8xl"}`}
          >
            <span className="text-primary">.</span>x3
          </h1>
          <p className="mt-4 text-lg text-fg/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            The agent proposes. Your .x3 orders decide. The chain proves it.
          </p>

          {hasSong && (muted || ended) ? (
            <button
              ref={soundRef}
              type="button"
              onClick={heard && !ended ? unmute : playWithSound}
              className="tap group mx-auto mt-8 flex min-h-14 items-center gap-3 rounded-full bg-fg px-7 text-base font-semibold text-bg shadow-[0_0_40px_rgba(46,200,255,0.45)] hover:brightness-110"
            >
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-full bg-primary text-bg transition-transform group-hover:scale-110"
              >
                ▶
              </span>
              {ended ? "Play it again" : heard ? "Sound back on" : `Play “${SONG.title}” with sound`}
            </button>
          ) : null}

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              ref={enterRef}
              type="button"
              onClick={enter}
              className={`tap min-h-12 w-full rounded-full px-8 text-base font-semibold sm:w-auto ${soundOn ? "bg-primary text-bg" : "border border-primary text-primary hover:bg-primary/10"}`}
            >
              Enter dotx3
            </button>
            <a
              href={href}
              onClick={rememberEntered}
              className="tap inline-flex min-h-12 w-full items-center justify-center rounded-full border border-accent px-8 text-base font-semibold text-accent hover:bg-accent/10 sm:w-auto"
            >
              Play MEME COIN BLAST
            </a>
          </div>

          {hasSong ? (
            <div className="mx-auto mt-6 w-full max-w-md">
              <div className="flex items-center justify-between gap-3 text-xs text-muted">
                <span>
                  {soundOn ? "Now playing" : "Evidence video"} · <span className="text-fg">{SONG.title}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="tabular-nums">{progress.length > 0 ? `-${clock(left)}` : SONG.length}</span>
                  {soundOn ? (
                    <button
                      type="button"
                      onClick={mute}
                      className="tap min-h-9 rounded-full border border-border px-3 text-fg hover:border-fg"
                    >
                      Mute
                    </button>
                  ) : null}
                </span>
              </div>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full bg-fg/15"
                role="progressbar"
                aria-label="Song progress"
                aria-valuemin={0}
                aria-valuemax={Math.round(progress.length)}
                aria-valuenow={Math.round(progress.at)}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-[width] duration-300 ease-linear motion-reduce:transition-none"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : null}

          <p className="mt-6 text-xs text-muted">
            Scenes marked DRAMATIZATION are AI-generated; explorer cards are testnet. MEME COIN BLAST uses play credits
            only: no wallet, no real money.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
