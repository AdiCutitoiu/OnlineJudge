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
          <div>
            <div class="headline">{{ item.title }}</div>
            <span>{{ item.description }}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-rating
            readonly
            v-model="item.difficulty"
            background-color="black"
            color="black"
          />
          <v-spacer/>
          <v-btn>Solve</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import api from "../requests/api";

const challenges = {
  getAllChallenges: function() {
    //return await api().get("/user/admin/patients", { useCredentials: true });
    return [
      {
        id: "1",
        title: "Lorem ipsum",
        difficulty: 4,
        description: "Lorem ipsum"
      },
      {
        id: "2",
        title: "Lorem ipsum",
        difficulty: 3,
        description: "Lorem ipsum"
      },
      {
        id: "3",
        title: "Lorem ipsum",
        difficulty: 2,
        description: "Lorem ipsum"
      }
    ];
  }
};

export default {
  name: "Challenges",
  data() {
    return {
      items: []
    };
  },
  mounted: function() {
    this.items = challenges.getAllChallenges();
  }
};
</script>

<style>
</style>
