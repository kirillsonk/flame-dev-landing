#!/bin/bash
# Монтаж фонового лупа первого экрана: три скринкаста → один ролик 16:9 без звука.
# Ролик живёт под затемнением и заголовком, поэтому важны спокойное движение и ровный цвет.
set -e
cd "$(dirname "$0")"

RAW=raw
OUT=out
mkdir -p "$OUT"

CLIP_LEN=5.0     # сколько берём от каждого скринкаста
FADE=0.8         # длительность перехода между кадрами
W=1280
H=720

# Каждый кусок: подрезаем разгон в начале, приводим к 1280×720@25, слегка поднимаем
# контраст и насыщенность — материал тёмный, под затемнением он не должен превратиться в грязь.
prep () {
  ffmpeg -hide_banner -loglevel error -y \
    -ss "$2" -t "$CLIP_LEN" -i "$RAW/$1.webm" \
    -vf "fps=25,scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},eq=contrast=1.06:saturation=1.06:brightness=0.01,unsharp=3:3:0.35" \
    -an -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p "$OUT/p-$1.mp4"
}

prep cgi 5.0
prep ai 2.0
prep app 2.0

# Склейка с перекрёстными переходами и затемнением на стыке петли:
# ролик начинается и заканчивается на фоновом цвете сайта, поэтому повтор не бросается в глаза.
FIRST=$(python3 -c "print(round($CLIP_LEN - $FADE, 3))")
SECOND=$(python3 -c "print(round(($CLIP_LEN - $FADE) * 2, 3))")
TOTAL=$(python3 -c "print(round($CLIP_LEN * 3 - $FADE * 2, 3))")
FADE_OUT=$(python3 -c "print(round($TOTAL - 0.6, 3))")

ffmpeg -hide_banner -loglevel error -y \
  -i "$OUT/p-cgi.mp4" -i "$OUT/p-ai.mp4" -i "$OUT/p-app.mp4" \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=$FADE:offset=$FIRST[a]; \
                   [a][2:v]xfade=transition=fade:duration=$FADE:offset=$SECOND[b]; \
                   [b]fade=t=in:st=0:d=0.6:color=0x262525,fade=t=out:st=$FADE_OUT:d=0.6:color=0x262525[v]" \
  -map "[v]" -an -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p "$OUT/master.mp4"

# Выдача: mp4 для всех, webm для современных браузеров, постер — кадр из первой сцены.
ffmpeg -hide_banner -loglevel error -y -i "$OUT/master.mp4" \
  -an -c:v libx264 -crf 27 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart \
  "$OUT/hero-overlay.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$OUT/master.mp4" \
  -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
  "$OUT/hero-overlay.webm"

ffmpeg -hide_banner -loglevel error -y -ss 1.5 -i "$OUT/master.mp4" -frames:v 1 -q:v 4 \
  "$OUT/hero-overlay.jpg"

echo "--- итог"
for f in "$OUT"/hero-overlay.mp4 "$OUT"/hero-overlay.webm "$OUT"/hero-overlay.jpg; do
  printf "%-28s %6s KB  " "$(basename "$f")" "$(( $(stat -f%z "$f") / 1024 ))"
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "$f" || echo
done
