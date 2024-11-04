import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import router from "./router";
import mitt from "mitt";

const app = createApp(App);

// Khởi tạo mitt và thêm nó vào root instance để sử dụng toàn ứng dụng
app.config.globalProperties.emitter = mitt();

app.use(router).mount("#app");
