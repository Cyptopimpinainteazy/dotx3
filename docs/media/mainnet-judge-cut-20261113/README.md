# Mainnet judge cut — 2026-11-13

Narrated evidence cut: 146.667 seconds, 1920×1080, 30 fps, H.264/AAC MP4;
VP9/Opus WebM offered first for Chromium/Firefox compatibility. Captions are
burned into the image, with a separate downloadable SRT. The previous video
remains available under its original filename.

## Rebuild

Requires Python, uv (or Pillow in a virtual environment), FFmpeg with libx264,
AAC and loudnorm. The three exact DejaVu font files and their license are bundled
in assets/fonts; no Linux system font path or font installation is required.
From this directory run:

```bash
uv run --with pillow python render.py
ffmpeg -i output/x3-force-field-mainnet-20261113.mp4 -c:v libvpx-vp9 -deadline realtime -cpu-used 6 -crf 30 -b:v 0 -c:a libopus -b:a 128k output/x3-force-field-mainnet-20261113.webm
```

All required source/voice assets are included. No resynthesis or model call is
needed to rebuild. Render output is ignored by Git; deliverables live under
public/media. The narration is one continuous original take at 1.0× speed.
HeyGen voice: Annie - Lifelike (public stock voice), English. Provider timing
and exact spoken text are retained in assets/narration.json. No cloned identity,
stock footage or music is used. Visuals are programmatically drawn from actual
source text, verifier output and committed evidence; they are not explorer UI
screenshots. Local refusals and archived mainnet records are explicitly labeled.

## Evidence

Source commit: f6543af8efaa430d19772a6da11d11b362d744d5 in Cyptopimpinainteazy/x3lang.
assets/invoice06-verifier.txt/json are actual offline verifier output.
The source/receipt anchors and full transaction hashes are available in that
repository's PROOF_CARD.md and invoice_06 evidence bundle. No new transaction,
provider quote or wallet signing was performed for the video.

The video retains manual owner funding, noncustodial Guard, agent-reported
outcome hashes, owner recovery key, no atomicity and no on-chain X3VM boundaries.
Three additional capabilities are local prototypes, not mainnet custody.

## Checks

Full encoded MP4 decode completed without errors. Audio measured -16.75 LUFS
integrated, -1.43 dBTP; 48 kHz mono AAC. Duration matches narration within one
video frame. Source frames and caption layout were visually checked. Production
publication is separate from this draft change.
