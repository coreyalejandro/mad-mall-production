# Integration Guide (React site)
This maps the rendered scenes into your existing React immersive site without structural changes.

## Mapping
- Hero (top): Scene 01 (Title Page) — background video with sky-floating title text.
- Chapters:
  - Intro → Scene 02 (Welcome)
  - Thyroid → Scene 03 (Thyroid)
  - Heart → Scene 04 (Heart)
  - Brain → Scene 05 (Brain & Nerves)
  - Skin/Hair → Scene 06 (Skin, Hair, Scalp)
  - Eyes → Scene 07 (Eyes)
  - Muscles/Bones → Scene 08 (Muscles & Bones)
  - Resilience → Scene 09 (Resilience & Healing)
  - Conclusion → Scene 10 (Conclusion)

## Implementation notes
- Autoplay must be **muted**, `playsInline`, and `loop`.
- Use a gradient overlay for text contrast (e.g., `from-black/50 via-transparent to-black/40`).
- Reduce Motion: when toggled, swap to `_RM` video or static poster image.
- Captions: include a toggle button; default **on** for narration sequences.

## Example JSX snippet (background video layer)
```tsx
{/* ParallaxScene children; ensure the video is behind the foreground content */}
<div className="absolute inset-0 -z-10">
  <video
    className="w-full h-full object-cover"
    src="/cdn/03_Thyroid/index.m3u8" // or /03_Thyroid_1080.mp4
    autoPlay
    muted
    loop
    playsInline
    preload="none"
    poster="/cdn/posters/03_Thyroid.jpg"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/40" />
</div>
```

## Performance
- Use IntersectionObserver to lazy-load video sources when sections enter the viewport.
- Preload only posters initially; progressively upgrade to 720p/1080p renditions.
- Prefer HLS for adaptive streaming; Safari plays `.m3u8` natively. For non-Safari, serve MP4 fallback or integrate HLS.js (requires adding dependency and small player wrapper).

## Accessibility
- Captions VTT loaded and toggled in the control bar.
- Reduce Motion variant must disable heartbeat micro-shake cues and slow camera.
- Provide a transcript link for each chapter section.

## File placement
- Place HLS directories under a CDN path, e.g., `/cdn/SCENE_SLUG/index.m3u8`.
- Posters: `/cdn/posters/SCENE_SLUG.jpg`.
- Captions: `/cdn/captions/en-US/SCENE_SLUG.vtt`.