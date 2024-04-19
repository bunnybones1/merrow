import {
  type Camera,
  type Object3D,
  Raycaster,
  type Scene,
  Vector2,
  type WebGLRenderer,
} from "three"
import {
  type CSS2DObject,
  type EffectComposer,
  OutlinePass,
  OutputPass,
} from "three/examples/jsm/Addons.js"

export function initRaycastSelectionOutlines(
  scene: Scene,
  camera: Camera,
  composer: EffectComposer,
  renderer: WebGLRenderer,
  labelPool: CSS2DObject[],
) {
  let selectedObjects: Object3D[] = []

  const raycaster = new Raycaster()
  const mouse = new Vector2()
  function onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (event.buttons === 0) {
      checkIntersections()
    }
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove)

  let labelIndex = 0
  function addSubSelection(obj: Object3D) {
    selectedObjects.push(obj)
    if (obj.userData.labelString) {
      const label = labelPool[labelIndex]
      labelIndex++
      label.element.textContent = obj.userData.labelString
      obj.add(label)
    }
  }
  function selectObject(object: Object3D) {
    labelIndex = 0
    selectedObjects = []
    addSubSelection(object)
    if (object.userData.connectedMeshes) {
      for (const obj of object.userData.connectedMeshes) {
        addSubSelection(obj)
      }
    }
    for (let i = labelIndex; i < labelPool.length; i++) {
      labelPool[i].element.textContent = ""
    }
  }

  function checkIntersections() {
    raycaster.setFromCamera(mouse, camera)

    const intersections = raycaster.intersectObject(scene, true)

    if (intersections.length > 0) {
      for (const intersection of intersections) {
        const selectedObject = intersection.object
        if (!selectedObject.userData.notSelectable) {
          selectObject(selectedObject)
          outlinePass.selectedObjects = selectedObjects
          break
        }
      }
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
  outlinePass.hiddenEdgeColor.set(0.25, 0.25, 0.25)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  window.addEventListener("resize", onWindowResize)

  function onWindowResize() {
    const width = window.innerWidth
    const height = window.innerHeight

    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();

    // renderer.setSize(width, height)
    composer.setSize(width, height)
  }
}
