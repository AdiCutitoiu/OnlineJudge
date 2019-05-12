<template>
  <nav>
    <v-navigation-drawer app permanent absolute overflow>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="text-xs-center">
                <h5 class="headline">{{email}}</h5>
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider class="mb-1 white"></v-divider>

      <v-list class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          active-class="white black--text"
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
import userData from "../requests/userData";
import router from "../router";
import api from "../requests/api";

export default {
  name: "Sidebar",
  data: () => ({
    items: [],
    email: ""
  }),
  mounted: function() {
    const isAdmin = () => userData.isAdmin();
    const isModerator = () => userData.isModerator();
    const isNormal = () => userData.isNormal();
    const isAnyone = () => isNormal() || isModerator() || isAdmin();

    api()
      .get("/users/profile")
      .then(res => {
        this.email = res.data.email;
      })
      .catch(() => {});

    const navItems = [
      {
        title: "Challenges",
        icon: "code",
        route: "/challenges",
        isShown: isAnyone
      },
      {
        title: "Users",
        icon: "supervisor_account",
        route: "/users",
        isShown: isAnyone
      },
      {
        title: "Articles",
        icon: "format_align_left",
        route: "/articles",
        isShown: isAnyone
      }
    ];

    this.items = navItems.filter(item => item.isShown());

    router.push(this.items[0].route);
  }
};
</script>

<style>
</style>
