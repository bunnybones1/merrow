import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { TetrahedronGeometry } from "three"

export function createTetrahedronGeometry(
  radius: number,
  detail: number,
): BufferGeometry {
  const geometry = new TetrahedronGeometry(radius, detail)
  return geometry
}

export const getTetrahedronGeometry = Memoizer.makeMemoized(
  createTetrahedronGeometry,
)
