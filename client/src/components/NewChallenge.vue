<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-stepper light v-model="e1">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Challenge details</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Examples</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">Tests</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-form>
              <v-text-field label="Challenge name" v-model="challenge.name"></v-text-field>
              <v-textarea box label="Task" auto-grow v-model="challenge.task"></v-textarea>
              <v-textarea box label="Input" auto-grow v-model="challenge.inputDesc"></v-textarea>
              <v-textarea box label="Output" auto-grow v-model="challenge.outputDesc"></v-textarea>
            </v-form>
            <v-btn color="primary" @click="e1 = 2">Next</v-btn>
            <v-btn flat to="/challenges">Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card flat class="mb-5">
              <v-card-actions>
                <v-btn @click="newExample.dialog = true">New</v-btn>
              </v-card-actions>
              <v-card-text>
                <table>
                  <tr>
                    <td>Input</td>
                    <td>Ouput</td>
                  </tr>
                  <tr v-for="(example, index) in challenge.examples" :key="index">
                    <td>
                      <pre>{{ example.input }}</pre>
                    </td>
                    <td>
                      <pre>{{ example.output }}</pre>
                    </td>
                  </tr>
                </table>
              </v-card-text>
            </v-card>

            <v-btn color="primary" @click="e1 = 3">Continue</v-btn>

            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card class="mb-5" color="grey lighten-1" height="200px"></v-card>

            <v-btn color="primary" @click="e1 = 1">Continue</v-btn>

            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-dialog light v-model="newExample.dialog" absolute max-width="500" persistent>
        <v-card>
          <v-card-title>New example</v-card-title>
          <v-form>
            <v-textarea class="mx-2" box label="Input" auto-grow v-model="newExample.input"></v-textarea>
            <v-textarea class="mx-2" box label="Output" auto-grow v-model="newExample.output"></v-textarea>
          </v-form>
          <v-card-actions>
            <v-spacer/>
            <v-btn class="white--text" color="deep-purple accent-4" @click="onNewChallengeOk">OK</v-btn>
            <v-btn flat @click="resetNewDialogData">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "NewChallenge",
  data() {
    return {
      e1: 0,
      challenge: {
        name: "",
        task: "",
        inputDesc: "",
        outputDesc: "",
        examples: [],
        tests: []
      },
      newExample: {
        dialog: false,
        input: "",
        output: ""
      }
    };
  },
  methods: {
    onNewChallengeOk() {
      const { input, output } = this.newExample;
      this.challenge.examples.push({ input, output });
      this.resetNewDialogData();
    },
    resetNewDialogData() {
      this.newExample.input = "";
      this.newExample.output = "";
      this.newExample.dialog = false;
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 5px;
  text-align: left;
  width: 50%;
  vertical-align: top;
}
</style>
