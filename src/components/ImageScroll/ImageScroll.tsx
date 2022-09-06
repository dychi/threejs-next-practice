import { NextPage } from 'next'
import Image from 'next/image'
import { Fragment, useEffect, useRef } from 'react'
import {
  Mesh,
  PerspectiveCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer,
} from 'three'

// Shader
import vertexSource from './vertex.glsl'
import fragmentSource from './fragment.glsl'
import { CanvasSize, ImagePlane } from '../../lib/image'

import styles from './ImageScroll.module.css'

const ImageScroll: NextPage = () => {
  // canvasのコンテナ用
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ウィンドウサイズ
    const w = window.innerWidth
    const h = window.innerHeight
    // const w = 500
    // const h = 500

    // レンダラーを作成
    const renderer = new WebGLRenderer()
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    const elm = mountRef.current
    // canvasにレンダラーのcanvasを追加
    elm?.appendChild(renderer.domElement)

    // ウィンドウとWebGLの座標を一致させるため、描画がウィンドウぴったりになるようにカメラを調整
    const fov = 60
    const fovRad = (fov / 2) * (Math.PI / 180)
    const dist = h / 2 / Math.tan(fovRad)
    const camera = new PerspectiveCamera(fov, w / h, 0.1, 1000)
    camera.position.z = dist

    // シーンを作成
    const scene = new Scene()

    const loader = new TextureLoader()
    // const texture = loader.load('../../../../000031.JPG')

    // const uniforms = {
    //   uTexture: { value: texture },
    //   uImageAspect: { value: 2137 / 1499 },
    //   uPlaneAspect: { value: 800 / 500 },
    //   uTime: { value: 0 }, // 時間経過
    // }

    // const geo = new PlaneBufferGeometry(800, 500, 100, 100)
    // const material = new ShaderMaterial({
    //   uniforms,
    //   vertexShader: vertexSource,
    //   fragmentShader: fragmentSource,
    // })

    // const mesh = new Mesh(geo, material)

    // scene.add(mesh)

    // Planeを作成
    const createMesh = (
      img: HTMLImageElement
    ): Mesh<PlaneBufferGeometry, ShaderMaterial> => {
      const texture = loader.load(img.src)

      const uniforms = {
        uTexture: { value: texture },
        uImageAspect: { value: img.naturalWidth / img.naturalHeight },
        uPlaneAspect: { value: img.clientWidth / img.clientHeight },
        uTime: { value: 0 },
      }
      const geo = new PlaneBufferGeometry(1, 1, 100, 100)
      const mat = new ShaderMaterial({
        uniforms,
        vertexShader: vertexSource,
        fragmentShader: fragmentSource,
      })

      const mesh = new Mesh(geo, mat)

      return mesh
    }

    const imagePlaneArray: ImagePlane[] = []
    const imgArr: HTMLImageElement[] = [...document.querySelectorAll('img')]
    for (const img of imgArr) {
      const mesh = createMesh(img)
      scene.add(mesh)

      const imagePlane = new ImagePlane(mesh, img)
      const size = new CanvasSize(window.innerWidth, window.innerHeight)
      imagePlane.setParams(size)
      imagePlaneArray.push(imagePlane)
    }

    // スクロール追従
    let targetScrollY = 0
    let currentScrollY = 0
    let scrollOffset = 0

    const lerp = (start, end, multiplier) => {
      return (1 - multiplier) * start + multiplier * end
    }
    const updateScroll = () => {
      targetScrollY = document.documentElement.scrollTop
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.1)
      scrollOffset = targetScrollY - currentScrollY
    }

    // 毎フレーム呼び出す
    const loop = () => {
      updateScroll()
      const size = new CanvasSize(window.innerWidth, window.innerHeight)
      for (const plane of imagePlaneArray) {
        plane.update(size, scrollOffset)
      }
      renderer.render(scene, camera)

      requestAnimationFrame(loop)
    }

    loop()

    return () => {
      elm?.removeChild(renderer.domElement)
    }
  })

  return (
    <Fragment>
      <div className={styles.container}>
        <ul className={styles.imageList}>
          {/* {imgArr.map((path, idx) => (
            <li key={idx}>
              <Image src={path} alt="idx" />
            </li>
          ))} */}
          <li className={styles.imageItem}>
            {/* <Image src={'/public/000031.JPG'} alt="" width={500} height={500} /> */}
            <picture className={styles.imageWrapper}>
              <img src={'http://localhost:3000/000031.JPG'} alt="" />
            </picture>
          </li>
          <li className={styles.imageItem}>
            {/* <Image src={'/public/000031.JPG'} alt="" width={500} height={500} /> */}
            <picture className={styles.imageWrapper}>
              <img src={'http://localhost:3000/000031.JPG'} alt="" />
            </picture>
          </li>
          <li className={styles.imageItem}>
            {/* <Image src={'/public/000031.JPG'} alt="" width={500} height={500} /> */}
            <picture className={styles.imageWrapper}>
              <img src={'http://localhost:3000/000031.JPG'} alt="" />
            </picture>
          </li>
          <li className={styles.imageItem}>
            {/* <Image src={'/public/000031.JPG'} alt="" width={500} height={500} /> */}
            <picture className={styles.imageWrapper}>
              <img src={'http://localhost:3000/000031.JPG'} alt="" />
            </picture>
          </li>
        </ul>
      </div>
      <div className={styles.canvas} ref={mountRef} />
    </Fragment>
  )
}

export default ImageScroll
