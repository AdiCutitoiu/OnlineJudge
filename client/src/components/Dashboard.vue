<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12></v-flex>
    </v-layout>
    
    <Sidebar @signout="onSignout"/>
    
    <router-view class="mt-5"></router-view>
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
  data: () => ({})
};
</script>

<style>
</style>
