#!/usr/bin/env bash
# HLS ladder (H.264/AVC) for a single MOV/MP4 input.
# Usage: ./encode_hls_h264.sh input.mov output_dir

set -euo pipefail

in="${1:-scene.mov}"
out_dir="${2:-hls_scene}"
mkdir -p "$out_dir"

ffmpeg -y -i "$in" -filter_complex \
"[0:v]split=5[v4k][v1440][v1080][v720][v540]; \
 [v4k]scale=w=3840:h=2160:flags=lanczos[v4k_s]; \
 [v1440]scale=w=2560:h=1440:flags=lanczos[v1440_s]; \
 [v1080]scale=w=1920:h=1080:flags=lanczos[v1080_s]; \
 [v720]scale=w=1280:h=720:flags=lanczos[v720_s]; \
 [v540]scale=w=960:h=540:flags=lanczos[v540_s]" \
 -map "[v4k_s]"   -map a:0 -c:v h264 -profile:v high -bf 2 -g 48 -keyint_min 48 -sc_threshold 0 -b:v 18M -maxrate 22M -bufsize 36M -pix_fmt yuv420p -c:a aac -b:a 320k -hls_time 4 -hls_playlist_type vod -hls_segment_filename "$out_dir/4k_%03d.ts"   "$out_dir/4k.m3u8" \
 -map "[v1440_s]" -map a:0 -c:v h264 -b:v 12M -maxrate 14M -bufsize 28M -pix_fmt yuv420p -c:a aac -b:a 256k -hls_time 4 -hls_segment_filename "$out_dir/1440_%03d.ts" "$out_dir/1440.m3u8" \
 -map "[v1080_s]" -map a:0 -c:v h264 -b:v 8M  -maxrate 10M -bufsize 20M -pix_fmt yuv420p -c:a aac -b:a 192k -hls_time 4 -hls_segment_filename "$out_dir/1080_%03d.ts" "$out_dir/1080.m3u8" \
 -map "[v720_s]"  -map a:0 -c:v h264 -b:v 5M  -maxrate 6M  -bufsize 10M -pix_fmt yuv420p -c:a aac -b:a 160k -hls_time 4 -hls_segment_filename "$out_dir/720_%03d.ts"  "$out_dir/720.m3u8" \
 -map "[v540_s]"  -map a:0 -c:v h264 -b:v 3M  -maxrate 3.5M -bufsize 7M  -pix_fmt yuv420p -c:a aac -b:a 128k -hls_time 4 -hls_segment_filename "$out_dir/540_%03d.ts"  "$out_dir/540.m3u8"

cat > "$out_dir/index.m3u8" <<EOF
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=22000000,RESOLUTION=3840x2160
4k.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=14000000,RESOLUTION=2560x1440
1440.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=10000000,RESOLUTION=1920x1080
1080.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=6000000,RESOLUTION=1280x720
720.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3500000,RESOLUTION=960x540
540.m3u8
EOF

echo "HLS ready at $out_dir/index.m3u8"