import type { Object3D, Texture } from "three"
import { MeshPhysicalMaterial } from "three"
import { Mesh } from "three"
import { getChamferedCylinderGeometry } from "./geometry/createChamferedCylinderGeometry"
import { physicalMatParamLib } from "./materials/physicalMatParamLib"

export function testModelCluster(pivot: Object3D, envMap: Texture) {
  for (let i = 0; i < 3; i++) {
    const height = 0.2 + i * 0.25
    const geometry = getChamferedCylinderGeometry(1, height, 32, 11, 0.05)
    const material = new MeshPhysicalMaterial({
      ...physicalMatParamLib.copper,
      envMap,
      flatShading: geometry.userData.requestFlatShading,
    })
    for (let j = 0; j < 3; j++) {
      const cube = new Mesh(geometry, material)
      cube.position.x = i * 2 - 2
      cube.position.y = j * height * 2
      pivot.add(cube)
    }
  }
}
