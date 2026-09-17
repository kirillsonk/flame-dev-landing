#!/bin/bash
# Промо-фон первого экрана: короткие удары с жёсткими склейками вместо длинных проездов.
# Ритм: 0.6–1.2 с на кадр, в каждом своё движение (наезд, отъезд, проводка), между блоками —
# короткая вспышка фирменным синим. Звука нет, ролик живёт под затемнением и заголовком.
set -e
cd "$(dirname "$0")"

RAW=raw
B=beats
OUT=out
rm -rf "$B"
mkdir -p "$B" "$OUT"

W=1280
H=720
FPS=25
N=0

# beat <источник> <старт> <длительность> <движение: push|pull|left|right>
beat () {
  local src=$1 start=$2 dur=$3 mode=$4
  local n
  n=$(printf "%02d" "$N")
  local motion
  case "$mode" in
    # zoompan c d=1 обрабатывает каждый кадр видео: масштаб накапливается от кадра к кадру.
    push) motion="zoompan=z='min(zoom+0.0016,1.28)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=$FPS" ;;
    pull) motion="zoompan=z='if(eq(on,0),1.26,max(zoom-0.0016,1.0))':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=$FPS" ;;
    left) motion="zoompan=z=1.18:d=1:x='iw/2-(iw/zoom/2)-on*2.2':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=$FPS" ;;
    right) motion="zoompan=z=1.18:d=1:x='iw/2-(iw/zoom/2)+on*2.2':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=$FPS" ;;
  esac
  ffmpeg -hide_banner -loglevel error -y -ss "$start" -t "$dur" -i "$RAW/$src.webm" \
    -vf "fps=$FPS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,$motion,setsar=1" \
    -an -c:v libx264 -crf 17 -preset veryfast -pix_fmt yuv420p "$B/$n.mp4"
  echo "file '$n.mp4'" >> "$B/list.txt"
  N=$((N + 1))
}

# Вспышка на стыке блоков: два кадра фирменного синего, 80 мс.
flash () {
  local n
  n=$(printf "%02d" "$N")
  ffmpeg -hide_banner -loglevel error -y -f lavfi -i "color=c=0x1029ff:s=${W}x${H}:r=$FPS:d=0.08" \
    -an -c:v libx264 -crf 17 -preset veryfast -pix_fmt yuv420p "$B/$n.mp4"
  echo "file '$n.mp4'" >> "$B/list.txt"
  N=$((N + 1))
}

# Блок 1 — Flame CGI: крупная графика, начинаем с наезда.
beat cgi 5.4 1.1 push
beat ai 3.2 0.7 left
beat app 3.0 0.9 pull
beat cgi 8.6 0.6 right

flash

# Блок 2 — продукт: интерфейс и генерация.
beat ai 6.1 1.0 push
beat app 5.4 0.7 right
beat cgi 11.4 0.9 pull
beat ai 9.0 0.6 left

flash

# Блок 3 — финал: длиннее кадры, движение успокаивается к петле.
beat app 8.2 1.0 push
beat cgi 14.2 1.2 left
beat ai 12.0 1.2 pull

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$B/list.txt" -c copy "$OUT/promo-raw.mp4"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/promo-raw.mp4")
FADE_OUT=$(python3 -c "print(round($DUR - 0.45, 3))")

# Грейд: глубже тени, чуть плотнее цвет, лёгкое виньетирование — материал уходит под текст,
# поэтому центр внимания должен быть в кадре, а края темнее.
ffmpeg -hide_banner -loglevel error -y -i "$OUT/promo-raw.mp4" \
  -vf "curves=all='0/0 0.12/0.05 0.55/0.58 1/1',eq=contrast=1.12:saturation=1.14,vignette=PI/5,\
fade=t=in:st=0:d=0.35:color=0x262525,fade=t=out:st=$FADE_OUT:d=0.45:color=0x262525" \
  -an -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p "$OUT/promo-master.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$OUT/promo-master.mp4" \
  -an -c:v libx264 -crf 27 -preset slow -profile:v high -pix_fmt yuv420p -movflags +faststart \
  "$OUT/hero-overlay.mp4"

ffmpeg -hide_banner -loglevel error -y -i "$OUT/promo-master.mp4" \
  -an -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 "$OUT/hero-overlay.webm"

ffmpeg -hide_banner -loglevel error -y -ss 1.2 -i "$OUT/promo-master.mp4" -frames:v 1 -q:v 4 \
  "$OUT/hero-overlay.jpg"

echo "--- итог"
for f in "$OUT"/hero-overlay.mp4 "$OUT"/hero-overlay.webm "$OUT"/hero-overlay.jpg; do
  printf "%-24s %6s KB  " "$(basename "$f")" "$(( $(stat -f%z "$f") / 1024 ))"
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "$f" || echo
done
