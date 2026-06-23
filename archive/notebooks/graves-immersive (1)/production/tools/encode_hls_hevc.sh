#!/usr/bin/env bash
# HLS ladder (HEVC/H.265, 10-bit) — Apple devices support HLS+HEVC.
# Usage: ./encode_hls_hevc.sh input.mov output_dir

set -euo pipefail

in="${1:-scene.mov}"
out_dir="${2:-hls_scene_hevc}"
mkdir -p "$out_dir"

ffmpeg -y -i "$in" -filter_complex \
"[0:v]split=5[v4k][v1440][v1080][v720][v540]; \
 [v4k]scale=w=3840:h=2160:flags=lanczos[v4k_s]; \
 [v1440]scale=w=2560:h=1440:flags=lanczos[v1440_s]; \
 [v1080]scale=w=1920:h=1080:flags=lanczos[v1080_s]; \
 [v720]scale=w=1280:h=720:flags=lanczos[v720_s]; \
 [v540]scale=w=960:h=540:flags=lanczos[v540_s]" \
 -map "[v4k_s]"   -map a:0 -c:v libx265 -x265-params "profile=main10:high-tier=1" -pix_fmt yuv420p10le -preset slow -crf 20 -tag:v hvc1 -c:a aac -b:a 320k -hls_time 4 -hls_playlist_type vod -hls_segment_filename "$out_dir/4k_%03d.ts"   "$out_dir/4k.m3u8" \
 -map "[v1440_s]" -map a:0 -c:v libx265 -pix_fmt yuv420p10le -crf 21 -tag:v hvc1 -c:a aac -b:a 256k -hls_time 4 -hls_segment_filename "$out_dir/1440_%03d.ts" "$out_dir/1440.m3u8" \
 -map "[v1080_s]" -map a:0 -c:v libx265 -pix_fmt yuv420p10le -crf 22 -tag:v hvc1 -c:a aac -b:a 192k -hls_time 4 -hls_segment_filename "$out_dir/1080_%03d.ts" "$out_dir/1080.m3u8" \
 -map "[v720_s]"  -map a:0 -c:v libx265 -pix_fmt yuv420p10le -crf 24 -tag:v hvc1 -c:a aac -b:a 160k -hls_time 4 -hls_segment_filename "$out_dir/720_%03d.ts"  "$out_dir/720.m3u8" \
 -map "[v540_s]"  -map a:0 -c:v libx265 -pix_fmt yuv420p10le -crf 26 -tag:v hvc1 -c:a aac -b:a 128k -hls_time 4 -hls_segment_filename "$out_dir/540_%03d.ts"  "$out_dir/540.m3u8"

cat > "$out_dir/index.m3u8" <<EOF
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=12000000,RESOLUTION=3840x2160,CODECS=\"hvc1.1.6.L153.B0\"
4k.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=8000000,RESOLUTION=2560x1440,CODECS=\"hvc1.1.6.L153.B0\"
1440.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,CODECS=\"hvc1.1.6.L153.B0\"
1080.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=1280x720,CODECS=\"hvc1.1.6.L153.B0\"
720.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2000000,RESOLUTION=960x540,CODECS=\"hvc1.1.6.L153.B0\"
540.m3u8
EOF

echo "HEVC HLS ready at $out_dir/index.m3u8"