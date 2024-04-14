import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { OctahedronGeometry } from "three"

export function createOctahedronGeometry(
  radius: number,
  detail: number,
): BufferGeometry {
  const geometry = new OctahedronGeometry(radius, detail)
  return geometry
}

export const getOctahedronGeometry = Memoizer.makeMemoized(
  createOctahedronGeometry,
)
