import { useEffect, useRef } from "react";
import { INTRO_EVENT, SONG } from "@/lib/song";

/**
 * The "Who Gets Paid" music video as a normal, always-on-the-page player. It is server
 * rendered, so it is there before any script runs, for visitors who skip the intro, and for
 * judges who come back later in the same session (the intro only opens once per session).
 * Nothing autoplays; the browser fetches only metadata until someone presses play.
 */
export function WatchVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // The intro plays the same song full-screen. Two copies playing at once is noise, so the
  // inline player pauses whenever the intro opens.
  useEffect(() => {
    const pause = () => videoRef.current?.pause();
    window.addEventListener(INTRO_EVENT, pause);
    return () => window.removeEventListener(INTRO_EVENT, pause);
  }, []);

  if (SONG.video === null) return null;

  return (
    <section id="watch" aria-labelledby="watch-title" className="scroll-mt-32 border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <p className="text-center font-display text-xs tracking-[0.3em] text-accent uppercase">
          Watch · {SONG.length}
        </p>
        <h2 id="watch-title" className="mt-3 text-center font-display text-3xl text-primary md:text-4xl">
          Who gets paid?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted">
          An agent proposes a payment. The owner's .x3 mandate decides. Guard enforces it. Three minutes, set to music.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-bg shadow-[0_0_60px_rgba(46,200,255,0.18)]">
          <video
            ref={videoRef}
            className="block aspect-video w-full bg-bg"
            poster={SONG.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={`${SONG.title} music video, ${SONG.length}`}
          >
            {SONG.webm !== null && <source src={SONG.webm} type='video/webm; codecs="vp9,opus"' />}
            <source src={SONG.video} type="video/mp4" />
            <a href={SONG.video}>Download the {SONG.title} video (MP4)</a>
          </video>
        </div>

        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-muted sm:flex-row">
          <p className="text-center sm:text-left">
            Scenes marked DRAMATIZATION are AI-generated. Explorer cards are testnet. Terminal shots are local runs. Nothing
            in the video is a mainnet settlement.
          </p>
          <a
            href={SONG.video}
            download
            className="tap inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-border px-5 font-semibold text-fg hover:border-primary"
          >
            Download MP4
          </a>
        </div>
      </div>
    </section>
  );
}
