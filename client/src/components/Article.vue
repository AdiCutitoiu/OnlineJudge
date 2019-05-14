<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <h1>{{ article.title }}</h1>
        <v-card>
          <div class="pa-3">
            <div v-for="(paragraph, index) in article.paragraphs" :key="index">
              <h2>{{paragraph.subtitle}}</h2>
              <p>{{ paragraph.text }}</p>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Article",

  data() {
    return {
      article: {
        title: "",
        paragraphs: []
      }
    };
  },
  mounted: async function() {
    const response = await this.$http.get(
      `/articles/${this.$router.currentRoute.params.id}`
    );
    this.article = response.data;
  }
};
</script>

<style>
</style>
