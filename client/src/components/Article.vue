<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <h1>{{ article.title }}</h1>
        <v-card>
          <div class="pa-3">
            <div v-for="(paragraph, index) in article.paragraphs" :key="index">
              <h2>{{paragraph.subtitle}}</h2>
              <p v-for="(line, lineIndex) in paragraph.lines" :key="lineIndex">{{line}}</p>
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
    this.article.paragraphs = this.article.paragraphs.map(paragraph => {
      return {
        subtitle: paragraph.subtitle,
        lines: paragraph.text.split("\n")
      };
    });
  }
};
</script>

<style>
</style>
