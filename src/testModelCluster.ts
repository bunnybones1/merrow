import type { Object3D } from "three"
import { MeshStandardMaterial } from "three"
import { Mesh } from "three"
import { getChamferedCylinderGeometry } from "./createChamferedCylinderGeometry"

export function testModelCluster(pivot: Object3D) {
  for (let i = 0; i < 3; i++) {
    const height = 0.2 + i * 0.25
    const geometry = getChamferedCylinderGeometry(1, height, 32, 11, 0.05)
    const material = new MeshStandardMaterial({
      color: 0xb87333, // Copper color
      roughness: 0.5, // Adjust the surface roughness
      metalness: 0.9, // Set the metalness to make it look more metallic,
    })
    for (let j = 0; j < 3; j++) {
      const cube = new Mesh(geometry, material)
      cube.position.x = i * 2 - 2
      cube.position.y = j * height * 2
      pivot.add(cube)
    }
  }
}
