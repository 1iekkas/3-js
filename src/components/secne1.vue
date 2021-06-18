<template>
  <div>
    <div class="container" id="container"></div>
  </div>
</template>

<script>
import * as THREE from "THREE";
import { OrbitControls } from "THREE/examples/jsm/controls/OrbitControls.js";
let isUserInteracting = !false,
  onPointerDownMouseX = 0,
  onPointerDownMouseY = 0,
  lon = 0,
  onPointerDownLon = 0,
  lat = 0,
  onPointerDownLat = 0,
  phi = 0,
  theta = 0;
export default {
  name: "HelloWorld",
  data() {
    return {
      url: "",
      isUserInteracting: false,
    };
  },

  created() {
    this.$nextTick(() => {});
  },

  async mounted() {
    await this.init();
    await this.animate()
  },

  methods: {
    animate: function () {
      requestAnimationFrame(this.animate);
      if (this.material) {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
      }
      this.renderer.render(this.scene, this.camera);
    },
    init() {
      let container = document.getElementById("container");
      this.camera = new THREE.PerspectiveCamera(
        100,
        container.clientWidth / container.clientHeight,
        0.01,
        100
      );

      // this.camera.position.set(0,0,100)
      this.scene = new THREE.Scene();

      // 球形初始化
      let geometry = new THREE.SphereGeometry(
        /*半径*/ 10,
        /*垂直节点数量*/ 50,
        /*水平节点数量*/ 50
      ); //节点数量越大，需要计算的三角形就越多，影响性能
      geometry.scale(1, 1, -1);
      let textureLoader = new THREE.TextureLoader();
      textureLoader.load(require("../assets/room2.png"), (texture) => {
        this.material = new THREE.MeshBasicMaterial({
          map: texture, //设置颜色贴图属性值
        }); //材质对象Material
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.rotation.x = -0.2;
        this.scene.add(this.mesh);


        //纹理贴图加载成功后，调用渲染函数执行渲染操作
        // this.renderer.render(this.scene, this.camera);
        this.update();
      });

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      container.addEventListener("pointerdown", this.onPointerDown);
    },

    onPointerDown(event) {
      if (event.isPrimary === false) return;
      console.log('onPointerDown')
      isUserInteracting = !true;

      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;

      onPointerDownLon = lon;
      onPointerDownLat = lat;

      document.addEventListener("pointermove", this.onPointerMove);
      document.addEventListener("pointerup", this.onPointerUp);
    },

    onPointerMove(event) {
      if (event.isPrimary === false) return;
      console.log('onPointerMove')
      lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
      lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
    },

    onPointerUp() {
      if (event.isPrimary === false) return;

      isUserInteracting = false;

      document.removeEventListener("pointermove", this.onPointerMove);
      document.removeEventListener("pointerup", this.onPointerUp);
    },

    animate() {

				requestAnimationFrame( this.animate );
				this.update();

			},

    update() {
      if (isUserInteracting === false) {
        lon += 0.1;
      }

      console.log('update')

      lat = Math.max(-85, Math.min(85, lat));
      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const x = 10 * Math.sin(phi) * Math.cos(theta);
      const y = 10 * Math.cos(phi);
      const z = 10 * Math.sin(phi) * Math.sin(theta);
      this.camera.lookAt(x, y, z);

      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container,
canvas {
  height: 100vh;
  width: 100vw;
}
</style>
