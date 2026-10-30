"""analyze <music>          -> prints bpm, first-beat phase, drop time, suggested offset
   mix <music> <meta.json> <offset> <out.wav>  -> music + synthesized SFX on every cue"""
import sys, json, subprocess
import numpy as np
from scipy import signal

SR = 48000

def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

def onset_env(x, hop=512):
    m = x.mean(1)
    f, t, Z = signal.stft(m, SR, nperseg=2048, noverlap=2048 - hop)
    S = np.log1p(np.abs(Z) * 100)
    flux = np.maximum(0, np.diff(S, axis=1)).sum(0)
    flux = (flux - flux.mean()) / (flux.std() + 1e-9)
    return flux, hop / SR

def analyze(path):
    x = load(path)
    env, dt = onset_env(x)
    best = None
    for bpm in np.arange(120, 170.01, 0.1):
        lag = 60 / bpm / dt
        # comb score over all phases
        n = len(env)
        idx = np.arange(0, n - 1, lag)
        for ph in np.linspace(0, lag, 24, endpoint=False):
            k = (idx + ph).astype(int); k = k[k < n]
            s = env[k].mean()
            if best is None or s > best[0]: best = (s, bpm, ph * dt)
    _, bpm, phase = best
    # drop: biggest jump in low-band energy (20-150 Hz), 1 s windows
    sos = signal.butter(4, 150, 'low', fs=SR, output='sos')
    low = signal.sosfilt(sos, x.mean(1))
    win = int(SR * .25)
    e = np.array([np.sqrt(np.mean(low[i:i + win] ** 2)) for i in range(0, len(low) - win, win)])
    e_db = 20 * np.log10(e + 1e-6)
    jump = np.array([e_db[i:i + 4].mean() - e_db[max(0, i - 4):i].mean() if i >= 4 else 0 for i in range(len(e_db))])
    i = int(np.argmax(jump[8:len(jump) // 2]) + 8)
    drop = i * win / SR
    spb = 60 / bpm
    # snap drop to nearest beat on the detected grid
    k = round((drop - phase) / spb); drop_snap = phase + k * spb
    print(json.dumps({'bpm': round(bpm, 2), 'phase': round(phase, 4), 'drop_raw': round(drop, 3),
                      'drop': round(drop_snap, 4), 'offset_for_beat16': round(drop_snap - 16 * spb, 4),
                      'duration': round(len(x) / SR, 3)}))

# ---------------- SFX kit ----------------
rng = np.random.default_rng(7)
def env_exp(n, tau): return np.exp(-np.arange(n) / (tau * SR))
def noise(n): return rng.standard_normal(n).astype(np.float32)
def bp(x, lo, hi, order=2): return signal.sosfilt(signal.butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)
def hp(x, f): return signal.sosfilt(signal.butter(2, f, 'high', fs=SR, output='sos'), x)
def lp(x, f): return signal.sosfilt(signal.butter(2, f, 'low', fs=SR, output='sos'), x)
def sine_sweep(n, f0, f1, tau):
    f = f1 + (f0 - f1) * np.exp(-np.arange(n) / (tau * SR))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def sfx(kind, spb):
    if kind == 'key':
        n = int(.05 * SR); x = bp(noise(n), 2500, 7000) * env_exp(n, .006) * .9
        x += np.sin(2 * np.pi * 1800 * np.arange(n) / SR) * env_exp(n, .004) * .2
        return x * .5, 0
    if kind == 'tick':
        n = int(.06 * SR); return np.sin(2 * np.pi * 2200 * np.arange(n) / SR) * env_exp(n, .008) * .5 + bp(noise(n), 4000, 9000) * env_exp(n, .003) * .4, 0
    if kind == 'hit':
        n = int(.35 * SR)
        x = sine_sweep(n, 160, 55, .03) * env_exp(n, .09) * 1.0
        x += bp(noise(n), 800, 5000) * env_exp(n, .025) * .6
        return np.tanh(x * 1.5) * .7, 0
    if kind == 'slash':
        n = int(.35 * SR); t = np.arange(n) / n
        x = noise(n); x = np.concatenate([bp(x[i:i + 2400], 900 + 7000 * (1 - i / n), 1400 + 9000 * (1 - i / n)) for i in range(0, n, 2400)])[:n]
        return x * np.sin(np.pi * t) ** .5 * env_exp(n, .2) * .9, 0
    if kind in ('boom', 'drop', 'final'):
        L = {'boom': 1.2, 'drop': 2.0, 'final': 3.0}[kind]; n = int(L * SR)
        x = sine_sweep(n, 120, 38, .08) * env_exp(n, L * .35) * 1.2
        x += lp(noise(n), 2500) * env_exp(n, .12) * .7
        x += hp(noise(n), 5000) * env_exp(n, L * .25) * .15
        return np.tanh(x * 1.3) * .8, 0
    if kind == 'riserCut':
        # reverse swell filling the beat before the drop
        n = int(spb * SR); t = np.arange(n) / n
        x = hp(noise(n), 3000) * t ** 3 * .6 + sine_sweep(n, 200, 1200, 1e9) * 0
        return x, 0
    if kind in ('whoosh', 'whooshLong'):
        L = .45 * spb / .4286 if kind == 'whoosh' else 1.6; n = int(L * SR); t = np.arange(n) / n
        x = noise(n); y = np.zeros(n); blk = 1200
        for i in range(0, n, blk):
            c = 500 + 5000 * np.sin(np.pi * i / n) ** 2
            y[i:i + blk] = bp(x[i:i + blk], c * .6, c * 1.6)
        return y * np.sin(np.pi * t) ** 2 * .8, 0
    raise ValueError(kind)

def mix(music_path, meta_path, offset, out):
    meta = json.load(open(meta_path))
    spb = meta['SPB']; total = meta['TOTAL'] + 0.0
    m = load(music_path) if music_path != '-' else np.zeros((1, 2), np.float32)
    n = int((total + .3) * SR)
    music = np.zeros((n, 2), np.float32)
    # music sample 0 aligns with film time (-offset_shift): film beat0 at meta OFFSET
    shift = int(round((meta['OFFSET'] - offset) * SR))  # >0: delay music
    src = m[max(0, -shift):]; dst0 = max(0, shift)
    k = min(len(src), n - dst0); music[dst0:dst0 + k] = src[:k]
    # fade out over last 0.6 s
    f = int(.6 * SR); music[-f:] *= np.linspace(1, 0, f)[:, None]
    fx = np.zeros(n, np.float32)
    for e in meta['EVENTS']:
        x, pre = sfx(e['type'], spb)
        start = int(e['t'] * SR) - (len(x) if e['type'] == 'riserCut' else 0)
        if e['type'] in ('whoosh',): start = int(e['t'] * SR)
        s0 = max(0, start); x = x[s0 - start:]; k = min(len(x), n - s0)
        fx[s0:s0 + k] += (x[:k] * e['gain']).astype(np.float32)
    mixd = music * .9 + fx[:, None] * .55
    peak = np.abs(mixd).max(); mixd = mixd / max(1, peak / .98)
    raw = mixd.astype(np.float32).tobytes()
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-',
                    '-af', 'loudnorm=I=-14:TP=-1.0:LRA=11', '-ar', str(SR), out], input=raw, check=True)

if __name__ == '__main__':
    if sys.argv[1] == 'analyze': analyze(sys.argv[2])
    else: mix(sys.argv[2], sys.argv[3], float(sys.argv[4]), sys.argv[5])
