export function lerp(a: number, b: number, dt: number) {
  const out = a + dt * (b - a)
  return Math.abs(b - out) > 0.00001 ? out : b
}
