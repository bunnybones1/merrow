import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { OctahedronGeometry } from "three"

export function createOctahedronGeometry(
  radius: number,
  detail: number,
  markForFlatShading = false,
): BufferGeometry {
  const geometry = new OctahedronGeometry(radius, detail)
  geometry.userData.requestFlatShading = markForFlatShading
  return geometry
}

export const getOctahedronGeometry = Memoizer.makeMemoized(
  createOctahedronGeometry,
)
