<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12></v-flex>
    </v-layout>

        <Sidebar @signout="$emit('signout')"/>
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
  data: () => ({})
};
</script>

<style>
</style>
