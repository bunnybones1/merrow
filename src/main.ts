import { WebGLRenderer } from "three"
import { PointLight } from "three"
import { PerspectiveCamera } from "three"
import { Scene } from "three"
import { HemisphereLight } from "three"
import { Object3D } from "three"
import type {} from "vite"
import { testModelCluster } from "./testModelCluster"

// Create a scene
const scene = new Scene()

// Create a camera
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)
camera.position.z = 5

// Create a renderer
const renderer = new WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create a ball
// const geometry = new IcosahedronGeometry(1, 4)
const pivot = new Object3D()

if (import.meta.hot) {
  import.meta.hot.accept("./testModelCluster", (mod) => {
    while (pivot.children.length > 0) {
      pivot.remove(pivot.children[0])
    }
    mod.testModelCluster(pivot)
  })
}

scene.add(pivot)
testModelCluster(pivot)
const worldLight = new HemisphereLight(0x7f7fff, 0x7f117f, 2)
const light = new PointLight(0xffffff, 10)
scene.add(worldLight)
scene.add(light)
light.position.set(0, 4, 4)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  pivot.rotation.x += 0.01
  pivot.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()

// Resize handler
function onWindowResize() {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener("resize", onWindowResize)
