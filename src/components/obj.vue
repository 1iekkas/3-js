<template>
  <div class="page">
    <div class="controls-table">
      <div
        class="controls-item"
        v-for="(item, index) in controlsList"
        :key="index"
        @click="changeSkin(index)"
      >
        <span
          class="controls-color-block"
          :style="{ background: item.color }"
        ></span>
      </div>
    </div>
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
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let renderEnabled = false
export default {
  data() {
    return {
      controlsList: [
        {
          name: "red",
          url: require("../assets/coca_red.jpg"),
          color: "red",
        },
        {
          name: "orange",
          url: require("../assets/coca_orange.jpg"),
          color: "orange",
        },
        {
          name: "red",
          url: require("../assets/coca_blue.jpg"),
          color: "blue",
        },
      ],
      ModelCover: [],
      windows: [
        "Side_Windows_Plane007",
        "Rear_Glass_Plane004",
        "Front_Windshield_Plane003",
      ], // 车窗
      circles: "Tires_Circle", // 车轮
      body: ["Body_Panels_Plane001-Mesh", "Front_Bumper_Plane000-Mesh_1"], // 车身主体
      body_top: ["Body_Panels_Plane001-Mesh_1"], // 车顶
      handle: ["Door_Handle_Plane006"], //扶手
      headLight: ["Headlight_Casing_Plane008"], // 车头灯
      bumper: ["Front_Bumper_Plane000-Mesh"], // 栅杠
      panels: [
        "Body_Aero_Plane010",
        "Side_Mirror_Cube001-Mesh",
        "Side_Mirror_Mount_Plane011",
      ], // 车架
      diffuser: [
        "Rear_Diffuser_Plane005",
        "Floor_Plane009",
        "Auxillary_Grids_Plane034",
        "Front_Bumper_Grid_Plane025",
        "License_Plate_Mesh002",
        "Exhaust_Cover_Plane012",
        "Front_Rims_Circle011",
        "Rear_Rims_Circle014",
        "Front_Rim_Lugnuts_Circle012",
      ],
      light: ["Taillight_Circle002-Mesh", "Taillight_Circle002-Mesh_1"],
      lightMark: ["Taillight_Circle002-Mesh_2"],
      gold: ["Front_Brakes_Circle013-Mesh_1", "Rear_Brakes_Circle018-Mesh_2"],
      gray: ["Front_Brakes_Circle013-Mesh_2", "Rear_Brakes_Circle018-Mesh_3"],
      select: false,
      mouse: {
        x: 0,
        y: 0,
      },
    };
  },

  created() {},

  async mounted() {
    await this.init();
    await this.animate();
  },

  methods: {
    //
    changeSkin(index) {
      this.ModelCover[0] = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load(this.controlsList[index].url),
      });
      this.update();
    },
    //
    init() {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("static/draco/gltf/");
      let container = document.getElementById("container");

      this.scene = new THREE.Scene();
      /* this.scene.background = new THREE.CubeTextureLoader()
        .setPath("static/")
        .load([
          "posx.jpg",
          "negy.jpg",
          "posy.jpg",
          "negy.jpg",
          "posz.jpg",
          "negz.jpg",
        ]); */

      this.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(10, 50, 240);
      
      // MTLLoader
      /* const mtlLoader = new MTLLoader();
      mtlLoader.setPath('/static/room/')
      mtlLoader.load('house.mtl', (mtl) => {
        //console.log()
        mtl.preload()
        this.mtl = mtl
      }) */

      const objLoader = new OBJLoader();
     /*  objLoader.setMaterials(this.mtl); */
      /* const objLoader = new GLTFLoader();
      objLoader.setDRACOLoader(dracoLoader); */
      objLoader.load("static/car/toyota.obj", (obj) => {
        console.log(obj);
        
        /* let obj = gltf.scene;
        
        obj.scale.set(3, 3, 3);
        obj.position.set(0, 0, 0);
        let mesh = obj.children.filter((e) => e.type !== "Group");
        let group = obj.children.filter((e) => e.type == "Group");
        if (group.length) {
          group.map((e) => (mesh = mesh.concat(e.children)));
        }

     
        if (mesh.length) {
       
        } */

        this.scene.add(obj);
      });

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.renderer.domElement.addEventListener(
        "click",
        this.onDocumentClick,
        false
      );
      // 设置光源
      const light = new THREE.PointLight(0xe9e9e9, 0.9);
      light.position.setScalar(100);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      this.controls.minZoom = 0.5;
      this.controls.maxZoom = 1;
      this.controls.enableZoom = !true;
      this.controls.autoRotate = !true;
      this.controls.autoRotateSpeed = 10;
      //this.update();
      //this.controls.addEventListener('change', this.update);
    },

    onDocumentClick(event) {
      // console.log(123);
      event.preventDefault();
      this.select = true;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      // calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(this.scene.children, true);
      if (this.select && intersects.length > 0) {
        console.log("构件名称：" + intersects[0].object.name);
        this.select = false;
      }
    },

    // do
    animate() {
      requestAnimationFrame(this.animate);
      this.update();
    },

    // 渲染
    update() {
      /* if(!renderEnabled) {
        
      } */
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

.page {
  position: relative;
}

.container {
  height: 100vh;
  width: 100vw;
}

.controls-table {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 200px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.controls-item {
  cursor: pointer;
}

.controls-color-block {
  width: 35px;
  height: 35px;
  display: block;
}
</style>