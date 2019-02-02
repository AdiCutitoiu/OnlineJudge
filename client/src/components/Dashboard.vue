<template>
  <v-container>
    
    <Toolbar @drawer="drawer = !drawer" @signout="onSignout" />
    <Sidebar @signout="onSignout" v-bind:drawer="drawer"/>
    
    <router-view class="mt-5"></router-view>
  </v-container>
</template>

<script>
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";

export default {
  name: "Dashboard",
  components: {
    Sidebar,
    Toolbar
  },
  methods: {
    onSignout: function() {
      this.$emit("signout");
    }
  },
  data: () => ({
    drawer: false
  })
};
</script>

<style>
</style>
