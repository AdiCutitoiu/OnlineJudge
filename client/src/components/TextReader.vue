<template>
  <div class="ma-0">
    <v-btn class="mr-2" color="success" @click="$refs.inputUpload.click()">
      <v-icon class="mr-2">cloud_upload</v-icon> Upload
    </v-btn>
    <input v-show="false" ref="inputUpload" type="file" @change="loadTextFromFile">
  </div>
</template>

<style>
</style>

<script>
export default {
  name: "TextReader",
  mounted() {
    this.$refs.inputUpload.value = '';
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => {
        const data = e.target.result;

        this.$refs.inputUpload.value = '';
        this.$emit("load", data);
      };
      reader.readAsText(file);
    }
  }
};
</script>
