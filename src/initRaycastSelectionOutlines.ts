import {
  type Camera,
  type Object3D,
  Raycaster,
  type Scene,
  Vector2,
  type WebGLRenderer,
} from "three"
import {
  type EffectComposer,
  FXAAShader,
  OutlinePass,
  OutputPass,
  ShaderPass,
} from "three/examples/jsm/Addons.js"

export function initRaycastSelectionOutlines(
  scene: Scene,
  camera: Camera,
  composer: EffectComposer,
  renderer: WebGLRenderer,
) {
  let selectedObjects: Object3D[] = []

  const raycaster = new Raycaster()
  const mouse = new Vector2()
  function onPointerMove(event) {
    if (event.isPrimary === false) return

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    checkIntersections()
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove)

  function addSelectedObject(object: Object3D) {
    selectedObjects = []
    selectedObjects.push(object)
  }

  function checkIntersections() {
    raycaster.setFromCamera(mouse, camera)

    const intersections = raycaster.intersectObject(scene, true)

    if (intersections.length > 0) {
      const selectedObject = intersections[0].object
      addSelectedObject(selectedObject)
      outlinePass.selectedObjects = selectedObjects
    } else {
      outlinePass.selectedObjects = []
    }
  }

  const outlinePass = new OutlinePass(
    new Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
  )
  composer.addPass(outlinePass)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  const effectFXAA = new ShaderPass(FXAAShader)
  effectFXAA.uniforms.resolution.value.set(
    1 / window.innerWidth,
    1 / window.innerHeight,
  )
  composer.addPass(effectFXAA)

  window.addEventListener("resize", onWindowResize)

  function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();

    // renderer.setSize(width, height)
    composer.setSize(width, height)

    effectFXAA.uniforms.resolution.value.set(
      1 / window.innerWidth,
      1 / window.innerHeight,
    )
  }
}
