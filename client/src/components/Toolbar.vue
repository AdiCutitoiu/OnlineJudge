<template>
  <v-toolbar flat app>
    <v-toolbar-side-icon class="grey--text" @click="onDrawer"></v-toolbar-side-icon>
    <v-toolbar-title class="text-uppercase grey--text">
      <span class="font-weight-light text-lowercase">i</span>
      <span>Care</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat @click="signout" color="grey">
      <span>Singout</span>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  methods: {
    signout: function() {
      this.$emit("signout");
    },
    onDrawer: function() {
      this.$emit("drawer");
    }
  },
  data: () => ({})
};
</script>

<style>
</style>
