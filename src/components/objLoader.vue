<template>
  <div class="page">
    <!--颜色控制器-->
    <div class="controls-table">
      <div
        class="controls-item"
        :class="{ active: controlsIndex == index }"
        v-for="(item, index) in controlsList"
        :key="index"
        @click="changeSkin(index)"
      >
        <span
          class="controls-color-block"
          :style="{ background: item.color }"
        ></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!--亮度控制器-->
    <div class="light-controls" @click="lightMove">
      <span class="light-controls-btn" id="light-btn" :style="{'top': `${t}px`}"></span>
    </div>
    <!--渲染主体-->
    <div class="container" id="container"></div>

    <!---->
    <div class="loading" v-show="loading">
      <img :src="require('../assets/loading.gif')" alt="">
    </div>
  </div>
</template>

<script>
import * as THREE from "THREE";
import { OrbitControls } from "THREE/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "THREE/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "THREE/examples/jsm/loaders/DRACOLoader";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
// DRACOLoader.setDecoderPath( 'three/js/libs/draco/gltf/' );
const textureCube = new THREE.CubeTextureLoader()
  .setPath("static/")
  .load([
    "posx.jpg",
    "negy.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ]);
let hasUpdate = true
let light_1, light_2, light_3
export default {
  data() {
    return {
      loading: true,
      controlsList: [
        {
          name: '月白',
          color: "white"
        },
        {
          name: "骑士黑",
          url: require("../assets/coca_red.jpg"),
          color: "#000000",
        },
        {
          name: "橘皮橙",
          url: require("../assets/coca_orange.jpg"),
          color: "#ff7900",
        },
        {
          name: "Robin egg blue",
          url: require("../assets/coca_blue.jpg"),
          color: "#01d1ff",
        },
        {
          name: "枫叶红",
          url: require("../assets/coca_blue.jpg"),
          color: "#c11d24",
        }
      ],
      controlsIndex: -1,
      custom: {
        body: {
          color: "#F44000",
        },
        silver: {
          color: "#333",
        },
        tire: {
          color: "black",
        },
        aluminium: {
          color: "#999",
        },
        chrome: {
          color: "gray",
        },
        chrome_19_pivot: {
          color: "#fff",
          transparent: true, //是否透明
          opacity: 0.5, //透明度
        },
        glass: {
          color: "black",
          transparent: true, //是否透明
          opacity: 0.9, //透明度
        },
        gum: {
          color: "#333",
        },
        Ford_Mustang_Shelby_Head_Light_Glass: {
           color: "black",
          transparent: true, //是否透明
          opacity: 0.1, //透明度
        }
      },
      select: false,
      logo: [],
      t: 50,
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
      if (this.controlsIndex == index) return;
      this.controlsIndex = index;
      this.skin.map((mesh) => {
        // console.log(mesh.name.indexOf("body") > -1);
        if (mesh.name.indexOf("body") > -1) {
          // console.log(mesh);
          mesh.material = new THREE.MeshStandardMaterial({
            color: this.controlsList[index].color,
            // map: new THREE.TextureLoader().load(this.controlsList[index].url),
            roughness: 0,
            metalness: 0.1,
          });
          mesh.material.envMap = textureCube;
          /* if (this.custom[key].transparent) {
            mesh.material.transparent = this.custom[key].transparent;
            mesh.material.opacity = this.custom[key].opacity;
          } */
        }
      });
      this.update();
    },
    //
    init() {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("static/draco/gltf/");
      let container = document.getElementById("container");

      this.scene = new THREE.Scene();

      // 相机
      this.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(10, 50, 200);

      //

      const objLoader = new GLTFLoader();
      objLoader.setDRACOLoader(dracoLoader);
      objLoader.load("static/mustang/m.gltf", (gltf) => {
        //console.log(gltf);
        let obj = gltf.scene;

        obj.scale.set(0.3, 0.3, 0.3);
        obj.position.set(0, 0, 0);
        // console.log(obj.children);
        

        // console.log(obj);

        this.scene.add(obj);

        // this.createLight(obj);
        this.addLight(obj);

        this.loading = false
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

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minZoom = 0.5;
      this.controls.maxZoom = 1;
      /* this.controls.minPolarAngle = 0; */
      this.controls.maxPolarAngle = Math.PI / 2.2;
      this.controls.enableZoom = true;
      this.controls.autoRotate = !true;
      this.controls.autoRotateSpeed = 10;

      this.controls.addEventListener("change", () => {
        // console.log('change')
        hasUpdate = true
      })
    },

    createLight(model) {
      // 创建聚光灯
      let spotLight = new THREE.SpotLight(0xffffff, this.t / 100);
      spotLight.position.set(80,0,0);
      spotLight.position.y += 300;
      spotLight.castShadow = true;
      spotLight.angle = Math.PI / 4; // 聚光灯的扩散范围，最大为Math.PI / 2
      spotLight.penumbra = 0.05; // 由于半影而衰减的聚光锥的百分比。取值介于0和1之间。默认值为零
      spotLight.decay = 2; // 光线沿光线距离变暗的量, 可理解为衰减速率
      spotLight.distance = 800; // 最大范围的光
      spotLight.castShadow = true; // 将光源能产生阴影的属性设置为true
      spotLight.shadow.mapSize.width = 2048; // 定义阴影贴图的宽度和高度,必须为2的整数此幂
      spotLight.shadow.mapSize.height = 2048; // 较高的值会以计算时间为代价提供更好的阴影质量
      spotLight.shadow.camera.near = 100; // 光源在世界坐标内的视角，物体的位置必须大于此最小值才能产生阴影
      spotLight.shadow.camera.far = 500;
      spotLight.shadow.camera.visible = true
      //console.log( spotLight.shadow)
      spotLight.target.position.set(100, 300, 0);
      //this.scene.add(spotLight);
      return spotLight;
    },

    addLight(model) {
      this.renderer.shadowMap.enabled = true;
      model.castShadow = true;
      light_1 = this.createLight(model);
      light_2 = this.createLight(model);
      light_3 = this.createLight(model);
      let lightHelper1 = new THREE.SpotLightHelper(light_1);
      let lightHelper2 = new THREE.SpotLightHelper(light_2);
      let lightHelper3 = new THREE.SpotLightHelper(light_3);
      this.addFloor(model)
      // console.log(light_1, light_2, light_3);
      this.scene.add(
        light_1,
        light_2,
        light_3,
        /* lightHelper1,
        lightHelper2,
        lightHelper3 */
      );
      this.scene.add(new THREE.AmbientLight(0xcccccc, 0.5));
      this.update();
    },

    // 创建地面，用于接收阴影
    addFloor(model) {
      // 创建平面
      const planeGeometry = new THREE.CircleGeometry(300, 300); // 生成平面几何
      const planeMaterial = new THREE.MeshLambertMaterial({
        // 生成材质
        color: '#ccc',
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial); // 生成平面网格
      planeMesh.receiveShadow = true; // 设置平面网格为接受阴影的投影面
      // planeMesh.position.set(0,0,0)
      planeMesh.position.copy(model.position)
      planeMesh.position.y = -0
      planeMesh.rotation.x = -Math.PI / 2; //绕X轴旋转90度
      //planeMesh.rotation.z = -50
      this.scene.add(planeMesh); // 添加到场景中
    },

    // 
    lightMove(e) {
      //console.log(event.clientY)
      this.t = e.clientY - 30
      light_1.intensity = 1 - (this.t / 100)
      hasUpdate = true
    },

    onDocumentClick(event) {
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
      
      if(hasUpdate) {
        console.log('animate')
        this.update();
        hasUpdate = false
      }
    },

    // 渲染
    update() {
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
  bottom: 5vh;
  left: 10vw;
  right: 10vw;
  width: 80vw;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: rgb(14, 14, 14, 0.5);
  padding: 20px 15px;
  border-radius: 10px;
  box-sizing: border-box;
}

.controls-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.1s linear;
}

.controls-item.active {
  transform: scale(1.5);
}

.controls-color-block {
  width: 35px;
  height: 25px;
  display: block;
  transform: skew(-30deg);
  -webkit-transform: skew(-30deg);
  -moz-transform: skew(-30deg);
  -o-transform: skew(-30deg);
  -ms-transform: skew(-30deg);
  margin-right: 15px;
}

/** */
.light-controls {
  position: absolute;
  top: 30px;
  right: 30px;
  width: 10px;
  height: 100px;
  background-color: white;
  cursor: pointer;
}

.light-controls-btn {
  background-color: #ff7900;
  display: block;
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  cursor: pointer;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  z-index: 2001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading img {
  
}
</style>
