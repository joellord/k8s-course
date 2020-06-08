<template>
  <header role="banner" class="pf-c-page__header">
    <div class="pf-c-page__header-brand">
      <router-link class="pf-c-page__header-brand-link" to="/">
        # Animated Meme Generator
      </router-link>
    </div>
    <div class="pf-c-page__header-nav">
      <nav class="pf-c-nav pf-m-end" id="page-layout-horizontal-nav-horizontal-nav" aria-label="Global">
        <ul class="pf-c-nav__horizontal-list">
          <li class="pf-c-nav__item">
            <router-link to="/generate" class="pf-c-nav__link">Generate Meme</router-link>
          </li>
          <li class="pf-c-nav__item">
            <router-link to="/view" class="pf-c-nav__link">View List</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>

export default {
  name: 'NavBar'
}
</script>

<style scoped>
ul {
  list-style-type: "none";
  margin: 0;
  padding: 0
}
li {
  display: inline-block;
}
</style>