<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card
          v-for="item in users"
          v-bind:key="item.id"
          color="grey lighten-2"
          class="black--text mb-2"
        >
          <v-card-title primary-title>
            <div>
              <div class="headline">{{ item.name }}</div>
              <div class="headline">{{ item.email }}</div>
              <span>{{item.role}}</span>
            </div>
          </v-card-title>

          <v-card-actions v-show="isAdmin">
            <v-spacer/>

            <v-btn color="green" v-if="item.role === 'Normal'" @click="promote(item)">Promote</v-btn>
            <v-btn color="warning" v-if="item.role === 'Moderator'" @click="demote(item)">Demote</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import userData from '../requests/userData'

export default {
  name: "Users",
  data: () => ({
    receivedUsers: [],
    isAdmin: false
  }),
  mounted: async function() {
    try {
      this.isAdmin = userData.isAdmin();

      const response = await this.$http.get(`/users`);
      this.receivedUsers = response.data;
    } catch (error) {
      //eslint-disable-next-line
      console.log(error);
    }
  },
  computed: {
    users() {
      return this.receivedUsers.filter(x => x.role !== "Admin");
    }
  },
  methods: {
    promote(user) {
      this.$http
        .put(`/users/${user._id}/promote`)
        .then(res => {
          user.role = res.data.role;
        })
        .catch(err => {
          //eslint-disable-next-line
          console.log(err);
        });
    },
    demote(user) {
      this.$http
        .put(`/users/${user._id}/demote`)
        .then(res => {
          user.role = res.data.role;
        })
        .catch(err => {
          //eslint-disable-next-line
          console.log(err);
        });
    }
  }
};
</script>

<style>
</style>
