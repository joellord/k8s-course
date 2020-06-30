<template>
  <main>
    <section class="pf-c-page__main-section pf-m-light">
      <div class="pf-c-content">
        <h1>List of Animated Memes</h1>
        <p>Contributions by other users</p>
      </div>
    </section>
    <section class="pf-c-page__main-section">
      <div class="pf-l-gallery pf-m-gutter">
        <div class="pf-l-gallery__item" v-for="image in images" :key="image.id">
          <div class="pf-c-card">
            <img :src="image.url">
            <div class="pf-c-card__body">{{ image.caption }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import config from "../config.json";

export default {
  name: "ImageList",
  data: function() {
    fetch(`${config.BASE_URL}/saved/images`)
      .then(resp => resp.json())
      .then(data => {
        this.images = data.map(i => {
          i.url = `${config.BASE_URL}/image/${i.filename}`;
          return i;
        });
      });
    return {
      images: []
    }
  }
}
</script>