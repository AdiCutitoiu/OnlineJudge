<template>
  <v-container>
    <Toolbar @signout="onSignout"/>
    <Sidebar @signout="onSignout"/>

    <v-content>
      <v-container fluid class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-content>
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
  data: () => ({})
};
</script>

<style>
</style>
