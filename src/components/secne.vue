<template>
  <div>
    <div class="container" id="container"></div>
  </div>
</template>

<script>
import * as THREE from "THREE";
import { OrbitControls } from "THREE/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "THREE/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "THREE/examples/jsm/loaders/DRACOLoader";
/* import { CubeTextureLoader } from "THREE/examples/jsm/loaders/CubeTextureLoader"; */
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";

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
    await this.animate();
  },

  methods: {
    init() {
      let container = document.getElementById("container");

      console.log(THREE);
      // 创建场景
      this.scene = new THREE.Scene();

      const line = new THREE.GridHelper(10, 10);
      const axisHelper = new THREE.AxesHelper(6);
      this.scene.add(line);
      this.scene.add(axisHelper);

      // 几何体
      const geometry = new THREE.BoxGeometry(10, 30, 10);
      geometry.scale(1, 1, 1);
      let matarial = new THREE.MeshLambertMaterial({ map: new THREE.TextureLoader().load("/static/wall/1.jpg") });

      let cube = new THREE.Mesh(geometry, matarial);
      cube.material.side = THREE.BackSide;
      this.scene.add(cube);
      // 创建相机
      this.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.01,
        10
      );
      //this.camera.up.set(0, 0, 0);
      this.camera.position.set(-0, -2, -3);

      this.camera.lookAt(3, 3, 3);
      const cameraLine = new THREE.CameraHelper(this.camera);
      this.scene.add(cameraLine);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      var light = new THREE.AmbientLight(0xffffff);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      this.controls.minZoom = 0.5;
      this.controls.maxZoom = 1;
      this.controls.enableZoom = true;
      this.controls.autoRotate = !true;
      this.controls.autoRotateSpeed = 10;
      this.update();
    },

    animate() {
      requestAnimationFrame(this.animate);
      this.update();
    },

    update() {
      this.renderer.render(this.scene, this.camera);
      //this.controls.update();
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
