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
            <v-card flat height="100%">
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
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onDetailsNext">Next</v-btn>
                <v-btn to="/challenges">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card flat height="100%">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="newExample.dialog = true" color="success">New</v-btn>
              </v-card-actions>
              <v-card-text>
                <div>
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
                </div>
              </v-card-text>
            </v-card>
            <v-card-actions>
                <v-btn depressed @click="e1 = 1">Back</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="onExamplesNext"
                  :disabled="challenge.examples.length === 0"
                >Next</v-btn>
                <v-btn depressed to="/challenges">Cancel</v-btn>
              </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card flat height="100%">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="newTest.dialog = true" color="success">New</v-btn>
              </v-card-actions>
              <v-card-text>
                <div>
                  <v-data-table
                    :headers="headers"
                    :items="challenge.tests"
                    class="elevation-1"
                    hide-actions
                  >
                    <template slot="items" slot-scope="props">
                      <td>
                        <pre>{{ props.item.input.substring(0, 50) }} {{props.item.input.length > 50 ? '...' : ''}}</pre>
                      </td>
                      <td>
                        <pre>{{ props.item.output.substring(0, 50) }} {{props.item.output.length > 50 ? '...' : ''}}</pre>
                      </td>
                    </template>

                    <template slot="no-data">
                      <p class="text-xs-center">No tests added yet</p>
                    </template>
                  </v-data-table>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn depressed @click="e1 = 2">Back</v-btn>
                <v-spacer></v-spacer>
                <v-progress-circular indeterminate color="primary" v-show="finished"></v-progress-circular>
                <v-btn
                  color="primary"
                  :disabled="challenge.tests.length === 0"
                  @click="onFinish"
                  :v-show="!finished"
                >Finish</v-btn>
                <v-btn depressed to="/challenges">Cancel</v-btn>
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
            <v-btn color="primary" @click="onNewExampleOk">OK</v-btn>
            <v-btn depressed @click="resetNewDialogData">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog light v-model="newTest.dialog" absolute max-width="500" persistent>
        <v-card>
          <v-card-title>New test</v-card-title>
          <v-form ref="formTest">
            <TextReader @load="loadInputFile"/>
            <v-textarea
              class="mx-2"
              box
              label="Input"
              :rules="[rules.notEmpty]"
              v-model="newTest.input"
              readonly
            ></v-textarea>

            <TextReader @load="loadOutputFile"/>
            <v-textarea
              class="mx-2"
              box
              label="Output"
              :rules="[rules.notEmpty]"
              v-model="newTest.output"
              readonly
            ></v-textarea>
          </v-form>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" @click="onNewTestOk">OK</v-btn>
            <v-btn depressed @click="resetNewTestDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import TextReader from "./TextReader";

export default {
  name: "NewChallenge",
  components: {
    TextReader
  },
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
        input: null,
        output: null
      },
      newTest: {
        dialog: false,
        input: null,
        output: null
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
      },
      finished: false
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
      this.$refs.formExample.reset();
      this.newExample.dialog = false;
    },
    onNewTestOk() {
      const { input, output } = this.newTest;

      if (this.$refs.formTest.validate() && input && output) {
        this.challenge.tests.push({ input, output });
        this.resetNewTestDialog();
      }
    },
    resetNewTestDialog() {
      this.$refs.formTest.reset();
      this.newTest.dialog = false;
    },
    onDetailsNext() {
      if (this.$refs.formDetails.validate()) {
        this.e1 = 2;
      }
    },
    onExamplesNext() {
      this.e1 = 3;
    },
    loadInputFile(fileData) {
      this.newTest.input = fileData;
    },
    loadOutputFile(fileData) {
      this.newTest.output = fileData;
    },
    onFinish() {
      this.finished = true;
      this.$http
        .post("/problems", this.challenge)
        .then(response => {
          this.$router.push("/challenges");
          this.finished = false;
          // eslint-disable-next-line
          console.log(response.data);
        })
        .catch(err => {
          this.finished = false;
          // eslint-disable-next-line
          console.log(err);
        });
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
