import React, { useEffect } from 'react'
import { useRef } from 'react'
import type { NextPage } from 'next'
import {
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGL1Renderer,
} from 'three'

const ThreejsCanvas: NextPage = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const w = 960
    const h = 560

    const renderer = new WebGL1Renderer()

    const elm = mountRef.current

    elm?.appendChild(renderer.domElement)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)

    const scene = new Scene()

    const camera = new PerspectiveCamera(45, w / h, 1, 1000)
    camera.position.set(0, 0, +1000)

    const geometry = new SphereGeometry(300, 30, 30)

    const loader = new TextureLoader()

    const texture = loader.load('/earthmap1k.jpeg')

    const material = new MeshStandardMaterial({
      map: texture,
    })

    const mesh = new Mesh(geometry, material)

    scene.add(mesh)

    const directionalLight = new DirectionalLight(0xffffff)
    directionalLight.position.set(1, 1, 1)

    scene.add(directionalLight)

    const tick = () => {
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }

    tick()

    return () => {
      elm?.removeChild(renderer.domElement)
    }
  })
  return <div ref={mountRef} />
}

export default ThreejsCanvas
