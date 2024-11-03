import { createWebHistory, createRouter } from "vue-router";
import BorrowBook from "@/views/BorrowBook.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
const routes = [
  {
    path: "/",
    name: "BorrowBook",
    component: BorrowBook,
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
