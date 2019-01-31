<template>
  <v-app dark>
    <v-container v-if="!loggedIn" fluid fill-height>
      <v-layout align-center justify-center>
        <Authentication @loggedIn="onLogin"></Authentication>
      </v-layout>
    </v-container>
    <v-container v-else>
      <v-layout align-center justify-center>
        <Dashboard @signout="onSignout"></Dashboard>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Authentication from "./components/Authentication";
import Dashboard from "./components/Dashboard";
import auth from "./util/authentication";

export default {
  name: "App",
  components: {
    Authentication,
    Dashboard
  },
  methods: {
    onLogin: function() {
      this.loggedIn = true;
    },
    onSignout: function() {
      this.$emit("signout");
      this.loggedIn = false;
    }
  },
  data() {
    return {
      loggedIn: auth.isAuthenticated()
    };
  }
};
</script>
