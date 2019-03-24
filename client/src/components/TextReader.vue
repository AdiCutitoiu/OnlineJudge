<template>
  <input type="file" @change="loadTextFromFile">
</template>

<script>
export default {
  name: "TextReader",
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        const data = e.target.result;

        this.$emit("load", data);
      };
      reader.readAsText(file);
    }
  }
};
</script>
