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
            </div>
          </div>
        </v-card>
        <codemirror class="mt-3" v-model="code" :options="cmOptions"></codemirror>
        <v-card>
          <v-card-actions>
            <v-spacer/>
            <v-btn v-if="!submitting" light @click="onSubmit">Submit</v-btn>
            <v-progress-circular size="36" v-if="submitting" indeterminate></v-progress-circular>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
//import api from "../requests/api";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";

// language
import "codemirror/mode/clike/clike.js";

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
import "codemirror/addon/selection/active-line.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
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

export default {
  name: "Challenge",
  components: {
    codemirror
  },
  data() {
    return {
      code: `
#include<iostream>
using namespace std;

int main()
{
  std::cout << "Hello world!\\n";

  return 0;
}`,
      cmOptions: {
        tabSize: 2,
        styleActiveLine: false,
        lineNumbers: true,
        styleSelectedText: false,
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "text/x-c++src",
        // hint.js options
        hintOptions: {
          completeSingle: false
        },
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "midnight",
        extraKeys: { Ctrl: "autocomplete" }
      },
      loaded: false,
      challenge: {},
      submitting: false
    };
  },
  mounted: async function() {
    this.challenge = (await this.$http.get("/problems/1")).data;
  },
  methods: {
    onSubmit() {
      this.submitting = true;
      this.$http
        .post("/problems/1/solutions", { code: this.code })
        .then(res => {
          // eslint-disable-next-line
          console.log(res);
        })
        .catch(() => {})
        .finally(() => {
          this.submitting = false;
        });
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
table {
  width: 100%;
}

table,
th,
td {
  border: 1px solid white;
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
