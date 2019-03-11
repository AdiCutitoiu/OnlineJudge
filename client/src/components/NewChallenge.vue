<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <v-stepper light v-model="e1" height="500px">
        <v-stepper-header>
          <v-stepper-step :complete="e1 > 1" step="1">Challenge details</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step :complete="e1 > 2" step="2">Examples</v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3">Tests</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card flat height="600px">
              <v-card-text>
                <v-form ref="formDetails">
                  <v-text-field
                    label="Challenge name"
                    v-model="challenge.name"
                    :rules="[rules.notEmpty]"
                  ></v-text-field>
                  <v-textarea box label="Task" v-model="challenge.task" :rules="[rules.notEmpty]"></v-textarea>
                  <v-textarea
                    box
                    label="Input"
                    v-model="challenge.inputDesc"
                    :rules="[rules.notEmpty]"
                  ></v-textarea>
                  <v-textarea
                    box
                    label="Output"
                    v-model="challenge.outputDesc"
                    :rules="[rules.notEmpty]"
                  ></v-textarea>
                </v-form>
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onDetailsNext">Next</v-btn>
                <v-btn color="error" to="/challenges">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card flat height="600px">
              <v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="newExample.dialog = true" color="success">New</v-btn>
                </v-card-actions>
                <v-data-table
                  :headers="headers"
                  :items="challenge.examples"
                  class="elevation-1"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td>
                      <pre>{{ props.item.input }}</pre>
                    </td>
                    <td>
                      <pre>{{ props.item.output }}</pre>
                    </td>
                  </template>

                  <template slot="no-data">
                    <p class="text-xs-center">No tests added yet</p>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-actions>
                <v-btn @click="e1 = 1">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="onExamplesNext"
                  :disabled="challenge.examples.length === 0"
                >Next</v-btn>
                <v-btn color="error">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card height="600px">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="newExample.dialog = true" color="success">New</v-btn>
              </v-card-actions>
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="challenge.examples"
                  class="elevation-1"
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <td class="row-text">
                      <pre>{{ props.item.input }}</pre>
                    </td>
                    <td class="row-text">
                      <pre>{{ props.item.output }}</pre>
                    </td>
                  </template>

                  <template slot="no-data">
                    <p class="text-xs-center">No tests added yet</p>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
            <v-card flat>
              <v-card-actions>
                <v-btn @click="e1 = 2">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="e1 = 1">Finish</v-btn>
                <v-btn color="error">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <v-dialog light v-model="newExample.dialog" absolute max-width="500" persistent>
        <v-card>
          <v-card-title>New example</v-card-title>
          <v-form ref="formExample">
            <v-textarea
              class="mx-2"
              box
              label="Input"
              :rules="[rules.notEmpty]"
              v-model="newExample.input"
            ></v-textarea>
            <v-textarea
              class="mx-2"
              box
              label="Output"
              :rules="[rules.notEmpty]"
              v-model="newExample.output"
            ></v-textarea>
          </v-form>
          <v-card-actions>
            <v-spacer/>
            <v-btn class="white--text" color="deep-purple accent-4" @click="onNewExampleOk">OK</v-btn>
            <v-btn color="error" @click="resetNewDialogData">Cancel</v-btn>
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
        tests: [
          {
            input: "a",
            output: "bbb"
          },
          {
            input: "aaa",
            output: "bbb"
          }
        ]
      },
      newExample: {
        dialog: false,
        input: "",
        output: ""
      },
      headers: [
        {
          align: "left",
          text: "Input",
          value: "input",
          sortable: false
        },
        {
          text: "Output",
          value: "output",
          sortable: false,
          align: "left"
        }
      ],
      rules: {
        notEmpty: v =>
          (v || "").trim().length !== 0 || "This field cannot be left empty"
      }
    };
  },
  methods: {
    onNewExampleOk() {
      if (this.$refs.formExample.validate()) {
        const { input, output } = this.newExample;
        this.challenge.examples.push({ input, output });
        this.resetNewDialogData();
      }
    },
    resetNewDialogData() {
      this.newExample.input = "";
      this.newExample.output = "";
      this.newExample.dialog = false;
    },
    onDetailsNext() {
      if (this.$refs.formDetails.validate()) {
        this.e1 = 2;
      }
    },
    onExamplesNext() {
      this.e1 = 3;
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
