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
export default {
  name: "ImageList",
  data: function() {
    fetch("http://localhost:3000/saved/images")
      .then(resp => resp.json())
      .then(data => {
        this.images = data.map(i => {
          i.url = "http://localhost:3000/image/" + i.filename;
          return i;
        });
      });
    return {
      images: []
    }
  }
}
</script>