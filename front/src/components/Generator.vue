<template>
  <main>
    <section class="pf-c-page__main-section pf-m-light">
      <div class="pf-c-content">
        <h1>Animated Meme Generator</h1>
        <p>Create your very own animated memes here</p>
      </div>
    </section>
    <section class="pf-c-page__main-section">
      <div class="pf-l-grid" id="getblank">
        <div class="pf-l-grid__item pf-m-12-col">
          <img :src="blankImg" v-show="showBlankImage" />
          <img src="../assets/processing.gif" v-show="showProcessingImage" />
          <img :src="captionImg" v-show="showCaptionedImage" @load="gotCaptionedImage" />
        </div>
        <div class="pf-l-grid__item pf-m-12-col" v-show="step === 1">
          <div class="pf-l-grid">
            <div class="pf-l-grid__item pf-m-4-col">
              Search Term
            </div>
            <div class="pf-l-grid__item pf-m-4-col">
              <input type="text" v-model="searchTerm">
            </div>
            <div class="pf-l-grid__item pf-m-4-col">
              <button type="button" v-on:click="getBlankImage">Search For Canvas</button>
            </div>
          </div>
        </div>
        <div class="pf-l-grid__item pf-m-12-col" v-show="step === 2">
          <button v-on:click="getBlankImage">Get New Image</button> or add caption
          <div class="pf-l-grid">
            <div class="pf-l-grid__item pf-m-4-col">
              Caption
            </div>
            <div class="pf-l-grid__item pf-m-4-col">
              <input type="text" v-model="caption">
            </div>
            <div class="pf-l-grid__item pf-m-4-col">
              <button type="button" v-on:click="generateImage">Captionize</button>
            </div>
          </div>
        </div>
        <div class="pf-l-grid__item pf-m-12-col" v-show="step === 4">
          <button v-on:click="saveToGallery">Save To Gallery</button>
        </div>
        <div class="pf-l-grid__item pf-m-12-col" v-show="step === 5">
          Image Saved! How about you visit the gallery?
        </div>
      </div>
    </section>
  </main>
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
  name: "Generator",
  methods: {
    getBlankImage: function() {
      this.file = `${userId}-${(new Date()).getTime()}`;
      this.blankImg = `${config.BASE_URL}/blankimage/${this.searchTerm}/${this.file}`;
      this.step = 2;
    },
    generateImage: function() {
      this.showBlankImage = false;
      this.showProcessingImage = true;
      this.captionImg = `${config.BASE_URL}/caption/${this.file}/${this.caption}`;
      this.step = 3;
    },
    gotCaptionedImage: function() {
      this.showProcessingImage = false;
      this.showCaptionedImage = true;
      this.step = 4;
    },
    saveToGallery: function() {
      fetch(`${config.BASE_URL}/image/${this.caption}/${this.file}`, {method: "post"})
        .then(() => {
          this.step = 5;
          this.showCaptionedImage = false;
        })
    }
  },
  data: function() {
    return {
      searchTerm: "",
      blankImg: "",
      caption: "",
      captionImg: "",
      file: "",
      showBlankImage: true,
      showProcessingImage: false,
      showCaptionedImage: false,
      step: 1
    }
  }
}
</script>