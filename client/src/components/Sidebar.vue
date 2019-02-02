<template>
  <nav>
    <Toolbar @drawer="drawer = !drawer" @signout="signout"></Toolbar>
    <v-navigation-drawer app v-model="drawer">
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>John Leider</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click="drawer = !drawer"
          router
          :to="item.route"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import auth from "../util/authentication";
import userData from "../requests/userData";
import Toolbar from "./Toolbar";

export default {
  name: "Sidebar",
  components: {
    Toolbar
  },
  methods: {
    signout: function() {
      auth.logout();
      this.$emit("signout");
    }
  },
  data: () => ({
    drawer: true
  }),
  computed: {
    items: () => {
      const isAdmin = () => userData.isAdmin();
      const isModerator = () => userData.isModerator();
      const isNormal = () => userData.isNormal();

      const navItems = [
        {
          title: "Challenges",
          icon: "code",
          route: "/",
          isShown: () => isNormal() || isModerator() || isAdmin()
        }
      ];

      const items = navItems.filter(item => item.isShown());

      return items;
    }
  }
};
</script>

<style>
</style>
