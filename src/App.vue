<template>
  <div id="app">
    <!-- <Secne /> -->
    <!-- <Mode v-if="false" />
    <RoomGltf /> -->
    <ObjLoader />
  </div>
</template>

<script>
import Secne from './components/secne.vue'
import Mode from './components/mode.vue'
import ObjLoader from './components/objLoader.vue'
import RoomGltf from './components/room-gltf.vue'
export default {
  name: 'App',
  components: {
    Secne,
    Mode,
    RoomGltf,
    ObjLoader
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
