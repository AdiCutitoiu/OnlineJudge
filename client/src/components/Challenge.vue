<template>
  <v-layout row>
    <v-flex xs12 sm8 offset-sm2>
      <codemirror v-model="code" :options="cmOptions" class="x"></codemirror>
    </v-flex>
  </v-layout>
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
      }
    };
  },
  mounted: function() {}
};
</script>

<style>
.CodeMirror {
  height: auto;
}
</style>
