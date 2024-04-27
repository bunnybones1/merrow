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

  function updatePosition(x: number, y: number, updateIntersections: boolean) {
    mouse.x = (x / window.innerWidth) * 2 - 1
    mouse.y = -(y / window.innerHeight) * 2 + 1

    if (updateIntersections) {
      checkIntersections()
    }
  }
  function onPointerMove(event: PointerEvent) {
    if (event.isPrimary === false) return
    updatePosition(event.clientX, event.clientY, event.buttons === 0)
  }

  let timeOnDown = 0
  const mouseDown = new Vector2()
  function onPointerDown(event: MouseEvent) {
    mouseDown.set(event.clientX, event.clientY)
    timeOnDown = performance.now()
  }
  function onPointerUp(event: MouseEvent) {
    const dist = mouseDown
      .sub(new Vector2(event.clientX, event.clientY))
      .length()
    const timePassed = performance.now() - timeOnDown
    console.log(dist, timePassed)
    if (dist > 20 || timePassed > 200) {
      return
    }
    updatePosition(event.clientX, event.clientY, true)
    if (selectedObjects.length > 0) {
      const target = selectedObjects[0]
      if (target.userData.onClick) {
        target.userData.onClick()
      }
    }
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove)
  renderer.domElement.addEventListener("pointerdown", onPointerDown)
  renderer.domElement.addEventListener("pointerup", onPointerUp)

  let labelIndex = 0
  function addSubSelection(obj: Object3D, showLabel: boolean) {
    selectedObjects.push(obj)
    if (obj.userData.labelString && showLabel) {
      const label = labelPool[labelIndex]
      labelIndex++
      label.element.textContent = obj.userData.labelString
      obj.add(label)
    }
  }
  function selectObject(object: Object3D) {
    labelIndex = 0
    selectedObjects = []
    addSubSelection(object, true)
    if (object.userData.connectedMeshes) {
      for (const obj of object.userData.connectedMeshes) {
        addSubSelection(obj, object.userData.isEdge)
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
        if (!selectedObject.userData.notSelectable && selectedObject.visible) {
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
