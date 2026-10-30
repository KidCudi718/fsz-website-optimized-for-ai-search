"""Code-made drift-phonk score on the film's beat grid (140 BPM, 72 beats + tail).
usage: python3 score.py out.wav"""
import sys, subprocess
import numpy as np
from scipy import signal

SR = 48000; BPM = 140; SPB = 60 / BPM; BEATS = 72; TAIL = 3.0
N = int((BEATS * SPB + TAIL) * SR)
rng = np.random.default_rng(11)
L = np.zeros(N); R = np.zeros(N)

def at(b): return int(round(b * SPB * SR))
def add(x, b, gain=1., pan=0.):
    i = at(b); k = min(len(x), N - i)
    if k <= 0: return
    L[i:i + k] += x[:k] * gain * (1 - max(0, pan)); R[i:i + k] += x[:k] * gain * (1 + min(0, pan))
def env(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def noise(n): return rng.standard_normal(n)
def bp(x, lo, hi): return signal.sosfilt(signal.butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def hp(x, f): return signal.sosfilt(signal.butter(2, f, 'high', fs=SR, output='sos'), x)
def lp(x, f): return signal.sosfilt(signal.butter(2, f, 'low', fs=SR, output='sos'), x)
def hz(m): return 440 * 2 ** ((m - 69) / 12)

# ---- instruments ----
def kick(g=1.):
    n = int(.4 * SR); t = np.arange(n) / SR
    f = 48 + 170 * np.exp(-t / .028)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .16)
    x += bp(noise(n), 1500, 6000) * env(n, .004) * .5
    return np.tanh(x * 2.2) * .8 * g
def clap():
    n = int(.35 * SR); x = np.zeros(n)
    for d in (0, .009, .018, .028):
        i = int(d * SR); m = n - i; x[i:] += bp(noise(m), 900, 4500) * env(m, .012 if d < .028 else .11)
    x += np.sin(2 * np.pi * 190 * np.arange(n) / SR) * env(n, .05) * .5
    return np.tanh(x * 1.4) * .55
def hat(open_=False):
    n = int((.18 if open_ else .05) * SR)
    return hp(noise(n), 7500) * env(n, .06 if open_ else .012) * .32
def cowbell(m, dur=.22, bright=1.):
    n = int(dur * SR); t = np.arange(n) / SR
    f1 = hz(m); f2 = f1 * 1.48
    x = signal.square(2 * np.pi * f1 * t) * .5 + signal.square(2 * np.pi * f2 * t) * .5
    x = bp(x, f1 * .9, min(f2 * 2.4, 16000)) * (env(n, .02) * .6 + env(n, .16) * .4)
    return x * .33 * bright
def b808(m, beats, glide_to=None):
    n = int(beats * SPB * SR); t = np.arange(n) / SR
    f0 = hz(m); f = np.full(n, f0)
    if glide_to is not None:
        g0 = int(n * .7); f[g0:] = f0 * (hz(glide_to) / f0) ** np.linspace(0, 1, n - g0)
    f *= 1 + .6 * np.exp(-t / .015)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    a = np.minimum(1, t / .004) * np.minimum(1, (n / SR - t) / .03)
    return np.tanh(x * 2.6) * a * .55
def riser(b0, b1):
    n = at(b1) - at(b0); t = np.arange(n) / n
    x = noise(n); y = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        c = 400 + 9000 * (i / n) ** 2
        y[i:i + blk] = bp(x[i:i + blk], c * .7, min(c * 1.5, 20000))
    add(y * t ** 2.2 * .5, b0)
def impact(g=1.):
    n = int(2.5 * SR); t = np.arange(n) / SR
    f = 34 + 90 * np.exp(-t / .07)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .9)
    x += lp(noise(n), 3000) * env(n, .2) * .5 + hp(noise(n), 6000) * env(n, .7) * .12
    return np.tanh(x * 1.6) * .8 * g

# ---- melody: F minor, 2-bar cowbell hook in 16ths (None = rest) ----
F5, Ab5, Bb5, C6, Db6, Eb6, G5, Eb5 = 77, 80, 82, 84, 85, 87, 79, 75
HOOK = [F5, None, F5, Ab5, None, F5, C6, None, Bb5, None, Ab5, F5, None, G5, Ab5, None,
        F5, None, F5, Ab5, None, C6, Db6, None, C6, None, Bb5, Ab5, None, G5, Eb5, None]
BASS = [(0, 41, 1.5, None), (1.5, 41, 1.0, 44), (2.5, 44, 1.5, None), (4, 39, 1.5, None), (5.5, 39, 1.0, 36), (6.5, 36, 1.5, 41)]  # (beat, midi, len, glide)

def hook(b0, bars2=1, lpf=None, gain=1.):
    for r in range(bars2):
        for i, m in enumerate(HOOK):
            if m is None: continue
            x = cowbell(m)
            if lpf: x = lp(x, lpf(b0 + r * 8 + i / 4))
            add(x, b0 + r * 8 + i / 4, gain, pan=.15 if i % 2 else -.15)

# intro: filtered hook opening up, pad drone, snare build, riser
for r in range(2):
    for i, m in enumerate(HOOK):
        if m is None: continue
        b = r * 8 + i / 4
        if b >= 15: continue
        cut = 500 + 6000 * (b / 15) ** 2
        add(lp(cowbell(m), cut), b, .9)
n = at(15); t = np.arange(n) / SR
pad = sum(np.sin(2 * np.pi * hz(m) * t + k) for k, m in enumerate([53, 56, 60]))
add(lp(pad, 900) * np.minimum(1, t / 2) * .06, 0)
for b in np.arange(8, 15, .5): add(clap(), b, .25 + .3 * (b - 8) / 7)
for b in np.arange(12, 15, .25): add(clap(), b, .35)
for b in np.arange(14, 15, .125): add(clap(), b, .45)
riser(9, 15)
# beat 15-16: near silence, one reversed swell
n = at(16) - at(15); add(hp(noise(n), 2500) * (np.arange(n) / n) ** 4 * .5, 15)

# main section 16..60
add(impact(1.0), 16)
for bar in range(16, 60, 4):
    for k in (0, 1.75, 2.5): add(kick(), bar + k)
    for k in (1, 3): add(clap(), bar + k)
    for h in np.arange(0, 4, .5): add(hat(h % 1 == .5 and h == 3.5), bar + h, .9)
    if (bar // 4) % 2 == 1:
        for h in np.arange(3, 4, 1 / 8): add(hat(), bar + h, .7)
    else:
        for h in np.arange(1.5, 2, 1 / 12): add(hat(), bar + h, .6)
for b0 in range(16, 60, 8):
    for (k, m, ln, g) in BASS: add(b808(m, ln, g), b0 + k)
    hook(b0, 1, gain=1.0)
add(impact(.7), 42)            # clock flip
add(impact(.6), 57)            # CODE ATC
# end: final hit, long 808, echoing cowbell
add(impact(1.2), 60)
add(b808(41, 6), 60, 1.0)
for i, m in enumerate([F5, Ab5, C6, Ab5]):
    for e in range(4): add(lp(cowbell(m), 4000 - e * 800), 60 + i * .75 + e * .375, .7 * .55 ** e, pan=(-.4 if e % 2 else .4))

# master: glue + limiter-ish
mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix /= np.abs(mix).max() / .97
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ac', '2', '-ar', str(SR), '-i', '-', sys.argv[1]],
               input=mix.astype(np.float64).tobytes(), check=True)
print('ok', len(mix) / SR)
