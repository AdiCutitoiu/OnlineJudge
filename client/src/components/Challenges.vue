<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-card
        v-for="item in items"
        v-bind:key="item.id"
        color="grey lighten-2"
        class="black--text mb-2"
      >
        <v-card-title primary-title>
          <div class="headline">{{ item.name }}</div>
        </v-card-title>
        <v-card-actions>
          <v-rating readonly v-model="item.difficulty" background-color="black" color="black"/>
          <v-spacer/>
          <v-btn :to="`/challenges/${item.id}`">Solve</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import api from "../requests/api";

export default {
  name: "Challenges",
  data() {
    return {
      items: []
    };
  },
  mounted: async function() {
    try {
      const res = await api().get("/problems");
      this.items = res.data;
    } catch (err) {
      this.items = [];
    }
  }
};
</script>

<style>
</style>
