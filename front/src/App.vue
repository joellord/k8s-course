<template>
  <div id="app" class="pf-l-grid pf-m-redhat-font">
    <div class="pf-l-grid__item pf-m-12-col">
      <NavBar />
    </div>
    <div class="pf-l-grid__item pf-m-12-col">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import "../node_modules/@patternfly/patternfly/patternfly.css";
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
