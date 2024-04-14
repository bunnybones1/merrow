import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { TetrahedronGeometry } from "three"

export function createTetrahedronGeometry(
  radius: number,
  detail: number,
  markForFlatShading = false,
): BufferGeometry {
  const geometry = new TetrahedronGeometry(radius, detail)
  geometry.userData.requestFlatShading = markForFlatShading
  return geometry
}

export const getTetrahedronGeometry = Memoizer.makeMemoized(
  createTetrahedronGeometry,
)
