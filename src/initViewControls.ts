import type { Camera } from "three"

export function initViewControls(camera: Camera, camDistance: number) {
  function orbitCamera(deltaX: number, deltaY: number) {
    camera.rotateX(deltaY * -0.01)
    camera.rotateY(deltaX * -0.01)
    camera.position.set(0, 0, 0)
    camera.translateZ(camDistance)
  }

  // Mouse move handler
  let lastMouseX: number | null = null
  let lastMouseY: number | null = null

  function onMouseMove(event: MouseEvent) {
    if (lastMouseX !== null && lastMouseY !== null) {
      const deltaX = event.clientX - lastMouseX
      const deltaY = event.clientY - lastMouseY
      orbitCamera(deltaX, deltaY)
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
