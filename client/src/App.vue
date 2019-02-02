<template>
  <v-app dark>
    <v-container v-if="!loggedIn" fluid fill-height>
      <v-layout align-center justify-center>
        <Authentication @loggedin="onLogin" dark></Authentication>
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
import router from "./router";

export default {
  name: "App",
  components: {
    Authentication,
    Dashboard
  },
  methods: {
    onLogin: function() {
      this.loggedIn = true;
      router.push("/");
    },
    onSignout: function() {
      auth
        .logout()
        .then(() => {
          this.loggedIn = false;
          router.push("/");
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      loggedIn: auth.isAuthenticated()
    };
  }
};
</script>
