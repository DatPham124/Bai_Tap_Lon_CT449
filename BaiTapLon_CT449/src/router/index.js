import { createWebHistory, createRouter } from "vue-router";

import BorrowBook from "@/views/BorrowBook.vue";
import RegisterUser from "@/components/auth/RegisterUser.vue";
import Login from "@/components/auth/Login.vue";

import Book from "@/views/Book.vue";
import AddBook from "@/components/book/AddBook.vue";
import EditBook from "@/components/book/EditBook.vue";

import Author from "@/views/Author.vue";
import AddAuthor from "@/components/author/AddAuthor.vue";
import EditAuthor from "@/components/author/EditAuthor.vue";

import User from "@/views/User.vue";
import AddUser from "@/components/user/AddUser.vue";
import EditUser from "@/components/user/EditUser.vue";

import Publisher from "@/views/Publisher.vue";
import AddPublisher from "@/components/publisher/AddPublisher.vue";
import EditPublisher from "@/components/publisher/EditPublisher.vue";

import AddBorrow from "@/components/borrow/AddBorrow.vue";
import EditBorrow from "@/components/borrow/EditBorrow.vue";
import UserAddBorrow from "@/components/borrow/UserAddBorrow.vue";

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
  { path: "/borrow/add", component: AddBorrow },
  { path: "/borrow/add/:id", name: "UserAddBorrow", component: UserAddBorrow },
  { path: "/borrow/edit/:id", name: "EditBorrow", component: EditBorrow },

  { path: "/register/user", component: RegisterUser },
  { path: "/login", name: "login", component: Login },

  { path: "/books", name: "ListBook", component: Book },
  { path: "/book/addbook", component: AddBook },
  { path: "/book/edit/:id", name: "EditBook", component: EditBook },

  { path: "/authors", name: "ListAuthor", component: Author },
  { path: "/authors/add", name: "AddAuthor", component: AddAuthor },
  { path: "/authors/edit/:id", name: "EditAuthor", component: EditAuthor },

  { path: "/users", name: "ListUser", component: User },
  { path: "/users/add", name: "AddUser", component: AddUser },
  { path: "/users/edit/:id", name: "EditUser", component: EditUser },

  { path: "/publishers", name: "ListPublisher", component: Publisher },
  { path: "/publishers/add", name: "AddPublisher", component: AddPublisher },
  {
    path: "/publishers/edit/:id",
    name: "EditPublisher",
    component: EditPublisher,
  },
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
