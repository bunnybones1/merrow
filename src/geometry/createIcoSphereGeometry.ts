import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { IcosahedronGeometry } from "three"

export function createIcoSphereGeometry(
  radius: number,
  detail: number,
): BufferGeometry {
  const geometry = new IcosahedronGeometry(radius, detail)
  return geometry
}

export const getIcoSphereGeometry = Memoizer.makeMemoized(
  createIcoSphereGeometry,
)
