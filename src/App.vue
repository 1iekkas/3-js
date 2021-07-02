<template>
  <div id="app">
    <!-- <Secne /> -->
    <!-- <Mode /> -->
    <!-- <OBJ /> -->
    <!-- <ObjLoader /> -->
    <!-- <Toyota /> -->
    <!-- <Rotate /> -->
    <!-- <FbxLoader /> -->
    <Test />
  </div>
</template>

<script>
import Secne from './components/secne.vue'
import Mode from './components/mode.vue'
import ObjLoader from './components/objLoader.vue'
import FbxLoader from './components/fbxLoader.vue'
import OBJ from './components/obj.vue'
import Toyota from './components/toyota.vue'
import Rotate from './components/rotate.vue'
import Test from './components/test.vue'
export default {
  name: 'App',
  components: {
    Secne,
    Mode,
    OBJ,
    FbxLoader,
    ObjLoader, // 保时捷
    Toyota, // 丰田 
    Rotate,
    Test
  }
}
</script>

<style>
body, html {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
