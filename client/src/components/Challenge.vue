<template>
  <div :v-show="loaded">
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <div class="pa-3">
            <h1>Task</h1>
            <p>Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
            <h1>Input</h1>
            <p>Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
            <h1>Output</h1>
            <p>Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
            <h1>Examples</h1>
            <div light>
              <table>
                <tr>
                  <th>Input</th>
                  <th>Ouput</th>
                </tr>
                <tr>
                  <td>0 1 2</td>
                  <td>3 4 5</td>
                </tr>
              </table>
            </div>
          </div>
        </v-card>
        <codemirror class="mt-3" v-model="code" :options="cmOptions"></codemirror>
        <v-card class="text-xs-right">
          <v-btn light @click="onSubmit">Submit</v-btn>
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
      code: `int main()
{
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
      loaded: false
    };
  },
  mounted: function() {
    this.loaded = true;
  },
  methods: {
    onSubmit() {
      this.$http.post("/problems/1/solutions", { code: this.code });
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
}
</style>
