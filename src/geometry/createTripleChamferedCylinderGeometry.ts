import { Memoizer } from "memoizer-ts"
import type { BufferGeometry } from "three"
import { LatheGeometry, Matrix4, Vector3 } from "three"
import { Vector2 } from "three"
import {
  BufferGeometryUtils,
  GeometryUtils,
} from "three/examples/jsm/Addons.js"
import { lerp } from "../utils/math/lerp"
import {
  createChamferedCylinderGeometry,
  getChamferedCylinderGeometry,
} from "./createChamferedCylinderGeometry"

export function createTripleChamferedCylinderGeometry(
  radius: number,
  height: number,
  resU: number,
  resV: number,
  spherifyB = 0.1,
  markForFlatShading = false,
): BufferGeometry {
  const geometry = createChamferedCylinderGeometry(
    radius,
    height / 3,
    resU,
    resV,
    spherifyB,
    markForFlatShading,
  )
  const mat4 = new Matrix4()
  const geometry2 = geometry.clone()
  mat4.makeTranslation(new Vector3(0, 2 / 3, 0))
  geometry2.attributes.position.applyMatrix4(mat4)
  const geometry3 = geometry.clone()
  mat4.makeTranslation(new Vector3(0, -2 / 3, 0))
  geometry3.attributes.position.applyMatrix4(mat4)

  return BufferGeometryUtils.mergeGeometries([geometry, geometry2, geometry3])
}

export const getTripleChamferedCylinderGeometry = Memoizer.makeMemoized(
  createTripleChamferedCylinderGeometry,
)
