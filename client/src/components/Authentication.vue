<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md7>
        <v-img :src="require('../assets/logo.svg')" class="my-2" contain height="200"></v-img>
        <h1 class="text-xs-center display-2 mb-3">Code Break</h1>
        <Login v-show="login" @changeform="changeForm" @login="handleLogin"></Login>
        <Register v-show="!login" @changeform="changeForm" @register="handleRegister"></Register>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Login from "./Login";
import Register from "./Register";
import authentication from "../util/authentication";

export default {
  name: "Authentication",
  components: {
    Login,
    Register
  },
  data: () => ({
    login: true
  }),
  methods: {
    changeForm: function() {
      this.login = !this.login;
    },
    handleLogin: async function(e, callback) {
      try {
        await authentication.login(e);
        callback(null);

        this.$emit("loggedin");
      } catch (err) {
        if (callback) {
          callback(err);
        }
      }
    },
    handleRegister: async function(e, callback) {
      try {
        await authentication.register(e);
        callback(null);

        this.$emit("loggedin");
      } catch (err) {
        if (callback) {
          callback(err);
        }
      }
    }
  }
};
</script>

<style>
</style>
