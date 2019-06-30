<template>
  <div>
    <v-layout v-if="showAddBtn" class="mb-2" row>
      <v-flex xs1 sm1 offset-sm1>
        <v-btn class="ml-0" color="success darken-2" to="new" append>NEW</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <v-card
          v-for="item in items"
          v-bind:key="item.id"
          color="grey lighten-2"
          class="black--text mb-2"
        >
          <v-card-title primary-title>
            <div>
              <div class="headline">{{ item.name }}</div>
              <span>{{item.task}}</span>
            </div>
          </v-card-title>

          <v-card-actions>
            <v-spacer/>

            <v-btn :to="`${item._id}`" append>Solve</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import api from "../requests/api";
import userData from "../requests/userData";

export default {
  name: "Challenges",
  data() {
    return {
      items: [],
      showAddBtn: userData.isAdmin() || userData.isModerator()
    };
  },
  mounted: async function() {
    try {
      const res = await api().get("/challenges");
      this.items = res.data;
    } catch (err) {
      this.items = [];
    }
  }
};
</script>

<style>
</style>
