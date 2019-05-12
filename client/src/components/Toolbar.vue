<template>
  <v-toolbar flat fixed prominent app>
    <v-btn flat @click="onBack" v-show="showBack">
      <v-icon large>arrow_back</v-icon>
    </v-btn>
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
  mounted: function() {
    setInterval(() => {
      this.showBack =
        (this.$router.currentRoute.fullPath.match(/\//g) || []).length > 1;
    }, 100);
  },
  methods: {
    signout: function() {
      this.$emit("signout");
    },
    onBack: function() {
      this.$router.back();
    }
  },
  data: () => ({
    showBack: false
  })
};
</script>

<style>
</style>
