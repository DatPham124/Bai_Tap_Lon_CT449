import { createWebHistory, createRouter } from "vue-router";
import BorrowBook from "@/views/BorrowBook.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";

// Hàm kiểm tra token trong localStorage
function isAuthenticated() {
  return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
}

const routes = [
  {
    path: "/",
    name: "BorrowBook",
    component: BorrowBook,
    meta: { requiresAuth: true }, // Đánh dấu route này yêu cầu đăng nhập
  },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Sử dụng global navigation guard để kiểm tra trạng thái đăng nhập
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
    if (!isAuthenticated()) {
      next("/login"); // Chuyển hướng đến trang đăng nhập
    } else {
      next(); // Cho phép truy cập nếu đã đăng nhập
    }
  } else {
    next(); // Tiếp tục nếu route không yêu cầu đăng nhập
  }
});

export default router;
