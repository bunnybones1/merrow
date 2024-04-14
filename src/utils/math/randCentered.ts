export function randCentered(scale = 1, offset = 0, randSrc = Math.random) {
  return (randSrc() - 0.5) * scale + offset
}
