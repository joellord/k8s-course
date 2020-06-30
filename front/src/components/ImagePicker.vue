<template>
  <div class="image-picker">
    <img :src="imgsrc" crossorigin="anonymous" v-show="!processing" @load="processing=true" />
    <img src="../assets/processing.gif" v-show="processing" />
    <br/><br/>
    <div v-show="showForm">
      <label for="searchTerm">Search for: </label>
      <input type="text" v-model="searchTerm" id="searchTerm" />
      <button v-on:click="getImage" type="button">Get New Image</button>
      <br/><br/>
      <label for="caption">Caption: </label>
      <input type="text" v-model="caption" id="caption" />
      <button v-on:click="addCaption" type="button">Add Caption</button>
    </div>
    <div v-show="showDownload">
      <button>Download</button>
    </div>
  </div>
</template>

<script>
import config from "../config.json";

const randomId = () => {
  const list = "0123456789abcdef";
  let id = "";
  for (let i=0; i < 25; i++) {
    if (i === 5 || i === 8 || i === 18) {
      id += "-";
      continue;
    }
    id += list[Math.round(Math.random()*(list.length-1))];
  }
  return id;
}

const userId = randomId();

export default {
  name: 'ImagePicker',
  methods: {
    getImage: function() {
      let requestId = `${userId}-${(new Date()).getTime()}`;
      let url = `${config.BASE_URL}/image/${this.searchTerm}/${requestId}`;
      this.imgsrc = url;
      this.imgid = requestId;
      console.log(`Got ${requestId}, stored imgid ${this.imgid}`);
      return {url, requestId};
    },
    addCaption: function() {
      this.processing = true;
      let url = `${config.BASE_URL}/caption/${this.imgid}/${this.caption}`;
      this.showForm = false;
      setTimeout(() => {
        this.imgsrc = url;
      }, 0);
      this.showDownload = true;
    }
  },
  data: function() {
    let img = this.getImage();
    return {
      searchTerm: "welcome",
      imgsrc: img.url,
      imgid: img.requestId,
      caption: "",
      showForm: true,
      showDownload: false,
      processing: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
