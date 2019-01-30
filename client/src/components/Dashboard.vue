<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12></v-flex>
    </v-layout>
    
    <Sidebar @signout="onSignout"/>
    
    <router-view></router-view>
  </v-container>
</template>

<script>
import Sidebar from "./Sidebar";

export default {
  name: "Dashboard",
  components: {
    Sidebar
  },
  methods: {
    onSignout: function() {
      this.$emit("signout");
    }
  },
  data: () => new Object()
};
</script>

<style>
</style>
