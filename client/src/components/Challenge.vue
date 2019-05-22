<template>
  <div :v-if="loaded">
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <h1>{{ challenge.name }}</h1>
        <v-card>
          <div class="pa-3">
            <h2>Task</h2>
            <p>{{ challenge.task }}</p>
            <h2>Input</h2>
            <p>{{ challenge.inputDesc }}</p>
            <h2>Output</h2>
            <p>{{ challenge.outputDesc }}</p>
            <h2>Examples</h2>
            <div>
              <table class="example">
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
            </div>
          </div>
        </v-card>
        <codemirror class="mt-3" v-model="currentLanguage.code" :options="cmOptions"></codemirror>
        <v-card>
          <v-card-actions>
            <TextReader @load="onUploadCode"/>

            <v-flex xs2>
              <v-select v-model="selected" :items="languageNames" @change="onLanguageChange"></v-select>
            </v-flex>

            <v-spacer/>

            <v-btn v-if="!submitting" light @click="onSubmit">Submit</v-btn>
            <v-progress-circular size="36" v-if="submitting" indeterminate></v-progress-circular>
          </v-card-actions>
          <v-card-text v-show="showLogPane">
            <v-card light v-show="error">
              <v-alert :value="true" color="error" icon="warning">Compilation Error</v-alert>
              <v-card-text>
                <pre>{{error}}</pre>
              </v-card-text>
            </v-card>
            <v-card light v-show="!error">
              <v-alert :value="true" color="primary">
                <h1 class="headline">Test results</h1>
              </v-alert>
            </v-card>
            <v-data-table
              v-show="!error"
              :headers="headers"
              :items="tests"
              class="elevation-1"
              hide-actions
              hide-headers
            >
              <template slot="items" slot-scope="props">
                <td>Test {{ props.item.name }}</td>
                <td>
                  <span class="body-1 success--text" v-if="props.item.result">PASS</span>
                  <span class="body-1 error--text" v-else>FAIL</span>
                </td>
                <td>in {{ props.item.time }} ms</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "jshint";

// language
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/javascript/javascript.js";

// theme css
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";

// require active-line.js
import "codemirror/addon/selection/active-line.js";

// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";

// hint
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";

//lint
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/javascript-lint.js";
import "codemirror/addon/lint/lint.css";

// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";

// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";

// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

import TextReader from "./TextReader";

export default {
  name: "Challenge",
  components: {
    codemirror,
    TextReader
  },
  data() {
    return {
      code: `#include<iostream>
using namespace std;

int main()
{
  std::cout << "Hello world!\\n";

  return 0;
}`,
      error: null,
      headers: [
        {
          text: "Test",
          align: "left",
          value: "number",
          sortable: false
        },
        {
          text: "Result",
          align: "left",
          value: "result",
          sortable: false
        },
        {
          text: "Time (ms)",
          align: "left",
          value: "time",
          sortable: false
        }
      ],
      tests: [],
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        styleSelectedText: false,
        line: true,
        foldGutter: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "text/x-c++src",
        // hint.js options
        hintOptions: {
          completeSingle: false
        },
        lint: false,
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: false,
        theme: "midnight",
        extraKeys: { Ctrl: "autocomplete" }
      },
      loaded: false,
      challenge: {},
      submitting: false,
      languages: {
        "C++": {
          identifier: "cpp",
          mode: "text/x-c++src",
          lint: false,
          code: `#include<iostream>
using namespace std;

int main()
{
  std::cout << "Hello world!\\n";

  return 0;
}`
        },
        JS: {
          identifier: "javascript",
          mode: "application/javascript",
          lint: true,
          code: `console.log('Hello world!');`
        }
      },
      selected: "C++",
      currentLanguage: {}
    };
  },
  computed: {
    showLogPane() {
      return this.error || this.tests.length;
    },
    languageNames() {
      return Object.keys(this.languages);
    }
  },
  mounted: async function() {
    this.currentLanguage = this.languages[this.selected];

    const response = await this.$http.get(
      `/problems/${this.$router.currentRoute.params.id}`
    );
    this.challenge = response.data;
  },
  methods: {
    onSubmit() {
      this.submitting = true;
      this.error = null;
      this.tests = [];
      this.$http
        .post(
          `/problems/${this.$router.currentRoute.params.id}/solutions/${
            this.currentLanguage.identifier
          }`,
          {
            code: this.currentLanguage.code
          }
        )
        .then(res => {
          if (res.data.error) {
            this.error = res.data.error;
            return;
          }

          if (res.data.tests) {
            this.tests = Array.from(res.data.tests, (x, index) => {
              return {
                name: index + 1,
                result: x.pass,
                time: x.time
              };
            });
          }
        })
        .catch(() => {})
        .finally(() => {
          this.submitting = false;
        });
    },
    onUploadCode(code) {
      this.currentLanguage.code = code;
    },
    onLanguageChange() {
      this.currentLanguage = this.languages[this.selected];
      this.cmOptions.mode = this.currentLanguage.mode;
      this.cmOptions.lint = this.currentLanguage.lint;
    }
  }
};
</script>

<style>
.CodeMirror {
  height: auto;
}
</style>

<style scoped>
.example {
  width: 100%;
}

.example,
.example th,
.example td {
  border: 1px solid white;
  border-collapse: collapse;
}

.example th,
.example td {
  padding: 5px;
  text-align: left;
  width: 50%;
  vertical-align: top;
}
</style>
