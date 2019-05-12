<template>
  <v-toolbar flat fixed prominent app>
    <v-toolbar-title class="text-uppercase">
      <span class="text-lowercase red--text text--darken-1">&lt;code</span>
      <span class="text-lowercase">br /&gt;</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat @click="signout" router :to="''">
      <span>Signout</span>
      <v-icon right>exit_to_app</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  methods: {
    signout: function() {
      this.$emit("signout");
    }
  },
  data: () => ({})
};
</script>

<style>
</style>
