import { Color, Mesh, WebGLRenderer } from "three"
import { PointLight } from "three"
import { PerspectiveCamera } from "three"
import { Scene } from "three"
import { HemisphereLight } from "three"
import { Object3D } from "three"
import type {} from "vite"
import { getIcoSphereGeometry } from "./geometry/createIcoSphereGeometry"
import { initResizeHandler } from "./initResizeHandler"
import { initViewControls } from "./initViewControls"
import HemisphereAmbientMaterial from "./materials/HemisphereAmbientMaterial"
import { testMermaidFlowchart } from "./testMermaidFlowchart"
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

const camDistance = 5
camera.position.z = camDistance

const renderer = new WebGLRenderer()

renderer.autoClear = false
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const pivot = new Object3D()
scene.add(pivot)
const pivotCluster = new Object3D()
pivot.add(pivotCluster)
const pivotMermaid = new Object3D()
pivot.add(pivotMermaid)

const worldColorTop = new Color(0.2, 0.5, 0.7).multiplyScalar(0.75)
const worldColorBottom = new Color(0.5, 0.1, 0.7).multiplyScalar(0.75)

const worldLight = new HemisphereLight(worldColorTop, worldColorBottom, 1.2)
const light = new PointLight(0xffffff, 10)
scene.add(worldLight)
scene.add(light)
light.position.set(0, 4, 4)

const bgScene = new Scene()
const bgCam = new PerspectiveCamera()
const bgSphere = new Mesh(
  getIcoSphereGeometry(1, 2),
  new HemisphereAmbientMaterial(worldColorTop, worldColorBottom),
)
bgSphere.scale.setScalar(1)
bgScene.add(bgSphere)

function rafRender() {
  requestAnimationFrame(rafRender)
  bgCam.quaternion.copy(camera.quaternion)
  bgCam.quaternion.copy(camera.quaternion)
  bgCam.scale.copy(camera.scale)
  bgCam.projectionMatrix.copy(camera.projectionMatrix)
  bgCam.projectionMatrixInverse.copy(camera.projectionMatrixInverse)
  renderer.render(bgScene, bgCam)
  renderer.render(scene, camera)
}
rafRender()

let simulateMermaid: (() => void) | undefined
function rafSimulate() {
  requestAnimationFrame(rafSimulate)
  if (simulateMermaid) {
    simulateMermaid()
  }
  pivot.rotation.x += 0.001
  pivot.rotation.y += 0.001
}
rafSimulate()

initResizeHandler(camera, renderer)
initViewControls(camera, camDistance)

if (import.meta.hot) {
  import.meta.hot.accept("./testModelCluster", (mod) => {
    while (pivotCluster.children.length > 0) {
      pivotCluster.remove(pivotCluster.children[0])
    }
    mod.testModelCluster(pivotCluster)
  })
}
testModelCluster(pivotCluster)

if (import.meta.hot) {
  import.meta.hot.accept("./testMermaidFlowchart", (mod) => {
    while (pivotMermaid.children.length > 0) {
      pivotMermaid.remove(pivotMermaid.children[0])
    }
    simulateMermaid = mod.testMermaidFlowchart(pivotMermaid)
  })
}
simulateMermaid = testMermaidFlowchart(pivotMermaid)
