# The Vest Week Ever, Ep 4: kinetic trailer

A 31-second kinetic-type promo for the Fri Oct 30, 2026 Vest X Space, written as code and rendered frame by frame.

- `index.html`: the film. 13 scenes on a 140 BPM beat grid, drawn on a canvas, with motion blur from 8 subframes per frame.
- `render.js`: renders it in headless Chromium (Playwright) and pipes the frames to ffmpeg.
- `audio.py`: `analyze` finds a track's tempo and drop. `mix` adds synthesized hits, whooshes, ticks and key clicks on every cue, then normalizes the loudness.
- `score.py`: a backup phonk score made in code, on the same grid.

## Rebuild

```
NODE_PATH=$(npm root -g) node render.js silent.mp4
python3 audio.py analyze music.mp3                 # read offset_for_beat16
python3 audio.py mix music.mp3 meta.json <offset> mix.wav
ffmpeg -i silent.mp4 -i mix.wav -c:v copy -c:a aac -b:a 256k -shortest out.mp4
```

The music was ElevenLabs Music v2 via Monid (take A, 140 BPM, drop at 7.30 s, offset 0.4464).
Fonts: Anton, Archivo Black, Space Grotesk and Archivo (SIL Open Font License, from Google Fonts).
