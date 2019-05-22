<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card
          v-for="item in items"
          v-bind:key="item.id"
          color="grey lighten-2"
          class="black--text mb-2"
        >
          <v-card-title primary-title>
            <div>
              <p class="headline">{{ item.problem.name }}</p>
              <p>by {{item.submitter.name}}</p>
              <p>Language: {{item.language}}</p>
            </div>
            <v-spacer/>
            <span class="headline green--text" v-if="item.result == 'Pass'">{{item.result}}</span>
            <span class="headline red--text" v-else>{{item.result}}</span>
          </v-card-title>

          <v-card-actions>
            <v-spacer/>

            <v-btn :to="`${item._id}`" append>View submission</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import api from "../requests/api";

export default {
  name: "Submissions",
  data() {
    return {
      items: []
    };
  },
  mounted: async function() {
    try {
      const res = await api().get("/submissions");
      this.items = res.data;
    } catch (err) {
      this.items = [];
    }
  }
};
</script>

<style>
</style>
