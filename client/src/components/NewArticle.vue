<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-stepper light v-model="e1" height="500px">
        <v-stepper-header>
          <v-stepper-step :complete="complete" step>New Article</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat light height="100%">
              <v-card-text>
                <v-form ref="formDetails">
                  <v-text-field
                    label="Article title"
                    v-model="article.title"
                    :rules="[rules.notEmpty]"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-text>
                <v-btn
                  color="success darken-2"
                  class="ml-0 mb-2"
                  @click="newParagraph.dialog = true"
                >New paragraph</v-btn>
                <v-list two-line class="grey lighten-4">
                  <v-list-tile v-show="article.paragraphs.length === 0">
                    <v-list-tile-content>
                      <v-list-tile-title class="text-xs-center">No paragraphs added</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <template v-for="(item, index) in article.paragraphs">
                    <v-list-tile :key="index" avatar ripple>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.subtitle }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ item.text }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <v-icon @click="deleteParagraph(index)" color="red lighten-1">delete</v-icon>
                      </v-list-tile-action>
                    </v-list-tile>
                    <v-divider v-if="index + 1 < article.paragraphs.length" :key="index"></v-divider>
                  </template>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!complete" @click="onSubmit">Submit</v-btn>
                <v-btn depressed to="/articles">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-dialog light v-model="newParagraph.dialog" absolute max-width="500" persistent>
        <v-card>
          <v-card-title>New paragraph</v-card-title>
          <v-form ref="formParagraph" class="mx-2">
            <v-text-field
              label="Subtitle"
              v-model="newParagraph.subtitle"
              :rules="[rules.notEmpty]"
            ></v-text-field>
            <v-textarea box label="Content" :rules="[rules.notEmpty]" v-model="newParagraph.text"></v-textarea>
          </v-form>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="onNewParagraphOk">OK</v-btn>
            <v-btn depressed @click="resetNewParagraphData">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "NewArticle",
  data() {
    return {
      e1: 0,
      article: {
        title: "",
        paragraphs: []
      },
      newParagraph: {
        subtitle: "",
        text: "",
        dialog: false
      },
      rules: {
        notEmpty: v =>
          (v || "").trim().length !== 0 || "This field cannot be left empty"
      }
    };
  },
  methods: {
    onNewParagraphOk() {
      if (this.$refs.formParagraph.validate()) {
        this.article.paragraphs.push({
          subtitle: this.newParagraph.subtitle,
          text: this.newParagraph.text
        });

        this.resetNewParagraphData();
      }
    },

    resetNewParagraphData() {
      this.$refs.formParagraph.reset();
      this.newParagraph.dialog = false;
    },

    deleteParagraph(index) {
      this.article.paragraphs.splice(index, 1);
    },

    onSubmit() {
      this.$http
        .post("/articles", this.article)
        .then(() => {
          this.$router.push("/articles");
        })
        .catch(() => {});
    }
  },
  computed: {
    complete() {
      return (
        this.article.paragraphs.length !== 0 &&
        this.article.title.trim().length !== 0
      );
    }
  }
};
</script>

<style scoped>
td {
  vertical-align: top;
}

td pre {
  font-size: 14px;
}
</style>
