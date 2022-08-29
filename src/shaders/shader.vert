// vertex shader (頂点シェーダー)
// このファイルに各頂点ごとの処理を記述します

varying vec2 vUv; // varying: 頂点シェーダーからピクセルシェーダーに変数を送るための装飾子

void main() {
	vUv = uv; // uv: ShaderMaterialで補完される vec2型(xy)の変数。テクスチャ座標のこと
	vec3 pos = position; // position: ShaderMaterialで補完される vec3型(xyz)の変換。ジオメトリの頂点

	gl_Position = vec4(pos, 1.0);
}