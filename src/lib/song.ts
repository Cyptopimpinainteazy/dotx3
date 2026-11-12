/**
 * The enter-page track: the "Who Gets Paid" music video, served from /public. The judge page in
 * x3lang plays the same file from dotx3.net, so keep the path stable.
 */
export const SONG: { title: string; video: string | null; poster: string; length: string } = {
  title: "Who Gets Paid",
  video: "/media/x3-shield-who-gets-paid.mp4",
  poster: "/media/x3-shield-who-gets-paid-poster.jpg",
  length: "2:56",
};

export const BLAST_URL = "/gallery/arcade/meme-coin-blast.html";

/** Window event that reopens the enter page with the song playing. */
export const INTRO_EVENT = "dotx3:intro";

/** Reopen the intro. Call it from a click so the browser lets the song play with sound. */
export function openIntro() {
  window.dispatchEvent(new CustomEvent(INTRO_EVENT, { detail: { withSound: true } }));
}
