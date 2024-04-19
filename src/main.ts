import {
  Color,
  DirectionalLight,
  Mesh,
  PMREMGenerator,
  WebGLRenderer,
} from "three"
import { PerspectiveCamera } from "three"
import { Scene } from "three"
import { Object3D } from "three"
import {
  CSS2DObject,
  CSS2DRenderer,
  EffectComposer,
  RenderPass,
} from "three/examples/jsm/Addons.js"
import type {} from "vite"
import ViewControls from "./ViewControls"
import { getIcoSphereGeometry } from "./geometry/createIcoSphereGeometry"
import { initRaycastSelectionOutlines } from "./initRaycastSelectionOutlines"
import { initResizeHandler } from "./initResizeHandler"
import HemisphereAmbientMaterial from "./materials/HemisphereAmbientMaterial"
import { testMermaidFlowchart } from "./testMermaidFlowchart"
import { deepenColor } from "./utils/color/deepenColor"

// Create a scene
const scene = new Scene()

// Create a camera
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const camDistance = 18
camera.position.z = camDistance
scene.add(camera)

const renderer = new WebGLRenderer()

renderer.autoClear = false
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const cssRenderer = new CSS2DRenderer()
cssRenderer.setSize(window.innerWidth, window.innerHeight)
cssRenderer.domElement.style.position = "absolute"
cssRenderer.domElement.style.top = "0px"
cssRenderer.domElement.style.pointerEvents = "none"
document.body.appendChild(cssRenderer.domElement)

function makeLabel() {
  const text = document.createElement("div")
  text.className = "label"
  text.textContent = ""

  const label = new CSS2DObject(text)
  scene.add(label)
  return label
}
renderer.autoClear = false
document.body.appendChild(renderer.domElement)

const pivot = new Object3D()
scene.add(pivot)
const pivotCluster = new Object3D()
pivot.add(pivotCluster)
const pivotMermaid = new Object3D()
pivot.add(pivotMermaid)

const worldColorTop = new Color(0.2, 0.5, 0.7).multiplyScalar(0.75)
const worldColorBottom = new Color(0.5, 0.1, 0.7).multiplyScalar(0.75)

const light = new DirectionalLight(0xffffff, 2)
// scene.add(worldLight)
scene.add(light)
light.position.set(0, 40, 4)

const bgScene = new Scene()
const bgCam = new PerspectiveCamera()
const bgSphere = new Mesh(
  getIcoSphereGeometry(1, 2),
  new HemisphereAmbientMaterial(worldColorTop, worldColorBottom),
)
bgSphere.scale.setScalar(1)
bgScene.add(bgSphere)

// postprocessing

const composer = new EffectComposer(renderer)

const renderBGPass = new RenderPass(bgScene, bgCam)
composer.addPass(renderBGPass)
const renderPass = new RenderPass(scene, camera)
renderPass.clear = false
composer.addPass(renderPass)

initRaycastSelectionOutlines(scene, camera, composer, renderer, [
  makeLabel(),
  makeLabel(),
  makeLabel(),
])

window.addEventListener("resize", onWindowResize)

function onWindowResize() {
  const width = window.innerWidth
  const height = window.innerHeight
  composer.setSize(width, height)
  cssRenderer.setSize(width, height)
}

const viewControls = new ViewControls(camera)

function rafRender() {
  requestAnimationFrame(rafRender)
  light.position.set(1, 1, 1).normalize()
  light.position.applyQuaternion(camera.quaternion)
  bgCam.quaternion.copy(camera.quaternion)
  bgCam.scale.copy(camera.scale)
  bgCam.projectionMatrix.copy(camera.projectionMatrix)
  bgCam.projectionMatrixInverse.copy(camera.projectionMatrixInverse)
  composer.render()
  cssRenderer.render(scene, camera)
}
rafRender()

let simulateMermaid: (() => void) | undefined
function rafSimulate() {
  requestAnimationFrame(rafSimulate)
  viewControls.simulate()
  if (simulateMermaid) {
    simulateMermaid()
  }
  // pivot.rotation.x += 0.001
  // pivot.rotation.y += 0.001
}
rafSimulate()

const envMaker = new PMREMGenerator(renderer)
const envMap = envMaker.fromScene(bgScene)

deepenColor(worldColorTop, 0.75)
deepenColor(worldColorBottom, 0.75)

initResizeHandler(camera, renderer)

// if (import.meta.hot) {
//   import.meta.hot.accept("./testModelCluster", (mod) => {
//     while (pivotCluster.children.length > 0) {
//       pivotCluster.remove(pivotCluster.children[0])
//     }
//     mod.testModelCluster(pivotCluster, envMap.texture)
//   })
// }
// testModelCluster(pivotCluster, envMap.texture)

if (import.meta.hot) {
  import.meta.hot.accept("./testMermaidFlowchart", (mod) => {
    while (pivotMermaid.children.length > 0) {
      pivotMermaid.remove(pivotMermaid.children[0])
    }
    simulateMermaid = mod.testMermaidFlowchart(pivotMermaid, envMap.texture)
  })
}
simulateMermaid = testMermaidFlowchart(pivotMermaid, envMap.texture)
