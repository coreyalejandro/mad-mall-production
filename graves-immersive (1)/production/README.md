# Production Package
Inside a Black Woman’s Body with Graves’ Disease: A Guided Tour

This folder contains everything needed to generate deterministic, clinically accurate video sequences (Sora), produce VO, music and SFX, master the content, encode web streams (HLS), run QA, and integrate into the existing React site.

Contents:
- Sora_Batch.jsonl — one-line-per-job batch for 10 scenes + reduce-motion variants
- Sora_Template.yaml — canonical parameter template
- ShotList.csv — tracking per scene
- VO_Script_en-US.md — time-fit narration script
- Captions_Template_en-US.vtt — caption file template (fill actual timings after edit)
- Audio_Mix_Specs.md — loudness, stems, and mix notes
- QA_Clinical_Checklist.md — anatomy/accuracy checklist
- QA_Representation_Checklist.md — representation/dignity checklist
- tools/encode_hls_h264.sh — HLS ladder (AVC)
- tools/encode_hls_hevc.sh — HLS ladder (HEVC/10-bit)
- Integration_Guide.md — how to map the videos into the current React app

Quick run:
1) Render scenes via Sora_Batch.jsonl (masters + reduce-motion).
2) Record VO from VO_Script_en-US.md, export 48 kHz WAV.
3) Design score/SFX; export stems as WAV.
4) Conform, color, mix to -16 LUFS; export masters (ProRes 4444 or DNxHR 444).
5) Encode HLS via tools scripts.
6) Finalize captions from template.
7) Run QA checklists.
8) Integrate per Integration_Guide.md.  
