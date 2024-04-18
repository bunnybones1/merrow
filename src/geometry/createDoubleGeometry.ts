import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { Matrix4, type Vector3 } from "three"
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js"

export function createDoubleGeometry(
  geometry: BufferGeometry,
  seperation: Vector3,
): BufferGeometry {
  const mat4 = new Matrix4()
  const geometry2 = geometry.clone()
  mat4.makeTranslation(seperation.clone().multiplyScalar(0.5))
  geometry2.attributes.position.applyMatrix4(mat4)
  const geometry3 = geometry.clone()
  mat4.makeTranslation(seperation.clone().multiplyScalar(-0.5))
  geometry3.attributes.position.applyMatrix4(mat4)

  return BufferGeometryUtils.mergeGeometries([geometry2, geometry3])
}

export const getDoubleGeometry = Memoizer.makeMemoized(createDoubleGeometry)
