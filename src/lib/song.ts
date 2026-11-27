/**
 * The enter-page track: the narrated mainnet evidence cut, served from /public.
 * The website uses this new cut; historical filenames remain available as separate assets.
 */
export const SONG: {
  title: string;
  video: string | null;
  /** VP9/Opus copy, offered first: plays in Firefox and Chromium without system H.264 codecs. */
  webm: string | null;
  poster: string;
  length: string;
} = {
  title: "X3 Force Field: Payment, Limits, Proof",
  video: "/media/x3-force-field-mainnet-20261113.mp4",
  webm: "/media/x3-force-field-mainnet-20261113.webm",
  poster: "/media/x3-force-field-mainnet-20261113-poster.png",
  length: "2:27",
};

export const BLAST_URL = "/gallery/arcade/meme-coin-blast.html";

/** Window event that reopens the enter page with the song playing. */
export const INTRO_EVENT = "dotx3:intro";

/** Reopen the intro. Call it from a click so the browser lets the song play with sound. */
export function openIntro() {
  window.dispatchEvent(new CustomEvent(INTRO_EVENT, { detail: { withSound: true } }));
}
