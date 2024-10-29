import { createWebHistory, createRouter } from "vue-router";
import BorrowBook from "@/views/BorrowBook.vue";
const routes = [
  {
    path: "/",
    name: "BorrowBook",
    component: BorrowBook,
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
