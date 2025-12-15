#!/usr/bin/env bash
set -euo pipefail
# Usage: ./download_optimize_video.sh <URL> [outbase]
URL="$1"
OUTBASE="${2:-assets/showreel}"

mkdir -p "$(dirname "$OUTBASE")"

command -v yt-dlp >/dev/null 2>&1 || { echo "yt-dlp not found" >&2; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found" >&2; exit 1; }

echo "Downloading $URL ..."
yt-dlp -f best -o "${OUTBASE}_raw.%(ext)s" "$URL"

# find downloaded raw file
RAW=$(ls ${OUTBASE}_raw.* 2>/dev/null | head -n1 || true)
if [ -z "$RAW" ]; then
  echo "Download failed or file not found" >&2
  exit 1
fi

echo "Transcoding to MP4 (H.264)..."
ffmpeg -y -i "$RAW" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart "${OUTBASE}.mp4"

echo "Transcoding to WebM (VP9)..."
ffmpeg -y -i "$RAW" -c:v libvpx-vp9 -b:v 0 -crf 32 -c:a libopus "${OUTBASE}.webm"

echo "Generating poster image..."
ffmpeg -y -i "${OUTBASE}.mp4" -ss 00:00:00.750 -vframes 1 -q:v 2 "${OUTBASE}.jpg"

echo "Cleaning up raw file"
rm -f "$RAW"

echo "Done: ${OUTBASE}.{mp4,webm,jpg}"
