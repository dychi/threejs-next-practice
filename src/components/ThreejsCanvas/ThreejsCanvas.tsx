import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import type { NextPage } from 'next'
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

// シェーダーソース
import vertexSource from '../../shaders/shader.vert'
import fragmentSource from '../../shaders/shader.frag'

const ThreejsCanvas: NextPage = () => {
  // #canvasのdivコンテナ用
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ウィンドウサイズ
    const w = window.innerWidth
    const h = window.innerHeight

    // レンダラーを作成
    const renderer = new WebGLRenderer()
    renderer.setSize(w, h) // 描画サイズ
    renderer.setPixelRatio(window.devicePixelRatio) // ピクセル比
    const elm = mountRef.current

    // canvasにレンダラーのcanvasを追加
    elm?.appendChild(renderer.domElement)

    // シーンを作成
    const scene = new Scene()

    // カメラを作成
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1)

    // 平面を作る(幅、高さ、横分割数、縦分割数)
    const geometry = new PlaneGeometry(2, 2, 1, 1)

    // マウス座標
    const mouse = new Vector2(0.5, 0.5)
    var targetRadius = 0.005

    // uniforms変数を定義
    const uniforms = {
      uAspect: {
        value: w / h,
      },
      uTime: {
        value: 0.0,
      },
      uMouse: {
        value: new Vector2(0.5, 0.5),
      },
      uRadius: {
        value: targetRadius,
      },
    }

    // シェーダーソースを渡してマテリアルを作成
    const material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
    })

    // メッシュを作成
    const mesh = new Mesh(geometry, material)

    // メッシュをシーンに追加
    scene.add(mesh)

    // render関数を定義
    const render = () => {
      // 次のフレームを要求
      requestAnimationFrame(() => {
        render()
      })

      // ミリ秒から秒に変換
      const sec = performance.now() / 1000

      // シェーダーに渡す時間を更新
      uniforms.uTime.value = sec

      // シェーダーに渡すマウスを更新
      uniforms.uMouse.value.lerp(mouse, 0.2)

      // シェーダーに渡す半径を更新
      uniforms.uRadius.value += (targetRadius - uniforms.uRadius.value) * 0.2

      // 画面に表示
      renderer.render(scene, camera)
    }

    render()

    const handleMouseMove = (x: number, y: number) => {
      mouse.x = x / w
      mouse.y = 1 - y / h
    }
    // マウス移動
    const handleWindowMouseMove = (event: MouseEvent) => {
      handleMouseMove(event.clientX, event.clientY)
    }
    window.addEventListener('mousemove', handleWindowMouseMove)

    // マウス: mousedown
    const handleWindowMouseDown = (event: MouseEvent) => {
      handleMouseMove(event.clientX, event.clientY)
      targetRadius = 0.15
    }
    window.addEventListener('mousedown', handleWindowMouseDown)

    // マウス: mouseup
    const handleWindowMouseUp = (event: MouseEvent) => {
      handleMouseMove(event.clientX, event.clientY)
      targetRadius = 0.005
    }
    window.addEventListener('mouseup', handleWindowMouseUp)

    return () => {
      elm?.removeChild(renderer.domElement)
      window.removeEventListener('mousemove', handleWindowMouseMove)
      window.removeEventListener('mousedown', handleWindowMouseDown)
      window.removeEventListener('mouseup', handleWindowMouseUp)
    }
  })
  return <div ref={mountRef} />
}

export default ThreejsCanvas
