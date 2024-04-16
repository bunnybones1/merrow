import {
  type Camera,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereGeometry,
} from "three"

export function initViewControls(camera: Camera, camDistance: number) {
  const virtualPivot = new Object3D()
  const helper = new Mesh(
    new SphereGeometry(2, 8, 6),
    new MeshBasicMaterial({
      wireframe: true,
      opacity: 0.02,
      transparent: true,
    }),
  )
  helper.userData.notSelectable = true
  helper.rotateX(Math.PI * 0.5)
  virtualPivot.add(helper)
  if (camera.parent) {
    camera.parent.add(virtualPivot)
  } else {
    console.warn("Camera is not a child of the scene! Cannot add helper")
  }
  function updateCam() {
    camera.position.copy(virtualPivot.position)
    camera.translateZ(camDistance)
  }
  function panCamera(deltaX: number, deltaY: number) {
    virtualPivot.translateX(-deltaX * 0.1)
    virtualPivot.translateY(deltaY * 0.1)
    updateCam()
  }

  function orbitCamera(deltaX: number, deltaY: number) {
    camera.rotateX(deltaY * -0.01)
    camera.rotateY(deltaX * -0.01)
    virtualPivot.quaternion.copy(camera.quaternion)
    updateCam()
  }

  // Mouse move handler
  let lastMouseX: number | null = null
  let lastMouseY: number | null = null

  function onMouseMove(event: MouseEvent) {
    if (lastMouseX !== null && lastMouseY !== null) {
      const deltaX = event.clientX - lastMouseX
      const deltaY = event.clientY - lastMouseY
      if (event.shiftKey) {
        panCamera(deltaX, deltaY)
      } else {
        orbitCamera(deltaX, deltaY)
      }
    }

    lastMouseX = event.clientX
    lastMouseY = event.clientY
  }

  // Add event listener
  function onMouseDown(event: MouseEvent) {
    lastMouseX = event.clientX
    lastMouseY = event.clientY
    window.addEventListener("mousemove", onMouseMove)
  }

  document.addEventListener("mousedown", onMouseDown)
  function onMouseUp(event: MouseEvent) {
    lastMouseX = null
    lastMouseY = null
    window.removeEventListener("mousemove", onMouseMove)
  }
  document.addEventListener("mouseup", onMouseUp)

  function onWheel(event: WheelEvent) {
    if (event.shiftKey) {
      virtualPivot.translateZ(event.deltaY)
    } else {
      virtualPivot.translateX(event.deltaX * 0.25)
      virtualPivot.translateY(event.deltaY * -0.25)
    }
    updateCam()
  }
  document.addEventListener("wheel", onWheel)
  // Touch move handler
  let lastTouchX: number | null = null
  let lastTouchY: number | null = null

  function onTouchMove(event: TouchEvent) {
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      if (lastTouchX !== null && lastTouchY !== null) {
        const deltaX = touch.clientX - lastTouchX
        const deltaY = touch.clientY - lastTouchY
        orbitCamera(deltaX, deltaY)
      }

      lastTouchX = touch.clientX
      lastTouchY = touch.clientY
    }
  }

  // Add event listener
  window.addEventListener("touchmove", onTouchMove)

  function onTouchEnd(event: TouchEvent) {
    console.log("hello (Touch ended)")
  }
  document.addEventListener("touchend", onTouchEnd)
}
