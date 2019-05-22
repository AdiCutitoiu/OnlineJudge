<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <v-card-text class="pa-2">
            <h1>Challenge: {{submission.problem.name}}</h1>
            <p class="ma-0">Author: {{submission.submitter.name}}</p>
            <p class="ma-0">Language: {{submission.language}}</p>
            <p class="ma-0">
              Result:
              <span v-if="submission.result == 'Pass'" class="green--text">{{submission.result}}</span>
              <span v-if="submission.result != 'Pass'" class="red--text">{{submission.result}}</span>
            </p>
          </v-card-text>
        </v-card>
        <codemirror class="mt-3" v-model="submission.code" :options="cmOptions"></codemirror>
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

export default {
  name: "Submission",
  components: {
    codemirror
  },
  data() {
    return {
      submission: {
        problem: {},
        submitter: {}
      },
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
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
        lint: true,
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: false,
        theme: "midnight",
        readOnly: true
      }
    };
  },
  mounted: async function() {
    const response = await this.$http.get(
      `/submissions/${this.$router.currentRoute.params.id}`
    );
    this.submission = response.data;

    this.cmOptions.mode =
      this.submission.language == "JavaScript"
        ? "application/javascript"
        : "text/x-c++src";
  }
};
</script>
