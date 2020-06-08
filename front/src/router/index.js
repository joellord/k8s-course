import Vue from "vue";
import Router from "vue-router";

import Generator from "@/components/Generator";
import ImageList from "@/components/ImageList";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        { path: "/", name: "Home", component: ImageList },
        { path: "/generate", name: "Generate", component: Generator },
        { path: "/view", name: "ImageList", component: ImageList }
    ]
});