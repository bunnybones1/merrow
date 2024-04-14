function makeSfc32(a: number, b: number, c: number, d: number) {
  let _a = a
  let _b = b
  let _c = c
  let _d = d
  return function sfc32() {
    _a >>>= 0
    _b >>>= 0
    _c >>>= 0
    _d >>>= 0
    let t = (_a + _b) | 0
    _a = _b ^ (_b >>> 9)
    _b = (_c + (_c << 3)) | 0
    _c = (_c << 21) | (_c >>> 11)
    _d = (_d + 1) | 0
    t = (t + _d) | 0
    _c = (_c + t) | 0
    return (t >>> 0) / 4294967296
  }
}

export function makeDetRand(a = 100, b = 200, c = 310, d = 444) {
  const gen = makeSfc32(a, b, c, d)
  return function detRand(min = 0, max = 1) {
    return gen() * (max - min) + min
  }
}
