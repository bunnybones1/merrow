import type { Color } from "three"

export function deepenColor(color: Color, brightness: number) {
  color.multiply(color).multiplyScalar(brightness)
}
