/**
 * The enter-page track. `video` is the music video, served from /public. Until the song file
 * is in the repo, `video` stays null and the page falls back to the silent protocol loop.
 */
export const SONG: { title: string; video: string | null; poster: string } = {
  title: "Who Gets Paid",
  video: null,
  poster: "/media/logo.jpg",
};

export const BLAST_URL = "/gallery/arcade/meme-coin-blast.html";
