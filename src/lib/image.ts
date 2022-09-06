import { Mesh, PlaneBufferGeometry, ShaderMaterial } from 'three'

export class ImagePlane {
  // プロパティ
  refImage: HTMLImageElement
  mesh: Mesh<PlaneBufferGeometry, ShaderMaterial>

  constructor(
    mesh: Mesh<PlaneBufferGeometry, ShaderMaterial>,
    img: HTMLImageElement
  ) {
    this.refImage = img
    this.mesh = mesh
  }

  setParams(canvasSize: CanvasSize) {
    // 参照するimg要素から大きさ、位置を取得してセット
    const rect = this.refImage.getBoundingClientRect()
    this.mesh.scale.x = rect.width
    this.mesh.scale.y = rect.height

    // window座標をWebGL座標に変換
    const x = rect.left - canvasSize.w / 2 + rect.width / 2
    const y = -rect.top + canvasSize.h / 2 - rect.height / 2
    this.mesh.position.set(x, y, this.mesh.position.z)
  }
  update(canvasSize: CanvasSize, scrollOffset: number) {
    this.setParams(canvasSize)
    this.mesh.material.uniforms.uTime.value = scrollOffset
  }
}

export class CanvasSize {
  w: number
  h: number
  constructor(w: number, h: number) {
    this.w = w
    this.h = h
  }
  set(w: number, h: number) {
    this.w = w
    this.h = h
  }
}
