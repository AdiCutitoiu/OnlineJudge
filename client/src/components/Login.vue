<template>
  <v-card class="elevation-12 flat">
    <v-toolbar dark color="primary">
      <v-toolbar-title>Login</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="email"
          :rules="[rules.required, rules.validEmail]"
          :type="'email'"
          prepend-icon="email"
          name="email"
          label="E-mail"
        ></v-text-field>

        <v-text-field
          prepend-icon="lock"
          name="password"
          label="Password"
          type="password"
          v-model="password"
          :rules="[rules.required, rules.min]"
          hint="At least 8 characters"
        ></v-text-field>
      </v-form>

      <p class="text-xs-center">
        Don't have an account?
        <a @click="changeForm">Register</a>
      </p>

      <v-alert
        :value="true"
        type="error"
        transition="scale-transition"
        dismissible
        v-show="errorMessage.length != 0"
      >{{errorMessage}}</v-alert>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="login" v-show="!disabled">Login</v-btn>
      <v-progress-circular indeterminate color="primary" v-show="disabled"></v-progress-circular>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "Login",
  data: () => ({
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters",
      validEmail: email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (
          re.test(String(email).toLowerCase()) ||
          "This is not a valid email address"
        );
      }
    },
    email: "",
    password: "",
    disabled: false,
    errorMessage: ""
  }),
  methods: {
    changeForm: function() {
      this.email = "";
      this.password = "";
      this.errorMessage = "";
      this.disabled = false;

      this.$emit("changeForm");
    },
    login: function() {
      this.errorMessage = "";
      if (!this.$refs.form.validate()) {
        return;
      }

      this.disabled = true;

      this.$emit(
        "login",
        { email: this.email, password: this.password },
        err => {
          this.disabled = false;

          if (err) {
            this.errorMessage = err.toString();
          }
        }
      );
    }
  }
};
</script>

<style>
</style>
