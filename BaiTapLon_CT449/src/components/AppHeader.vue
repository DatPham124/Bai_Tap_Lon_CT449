<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
            <router-link to="/" class="custom-link">
                <h3>Quản lý mượn sách</h3>
            </router-link>

            <nav class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <router-link class="nav-link px-2" to="/book">Sách</router-link>
                <a href="#" class="nav-link px-2">Tác giả</a>
                <a href="#" class="nav-link px-2">Độc giả </a>
                <a href="#" class="nav-link px-2">Nhà xuất bản</a>
            </nav>

            <div class="col-md-3 text-end">
                <div v-if="isLoggedIn" class="dropdown">
                    <img src="https://via.placeholder.com/40" class="rounded-circle dropdown-toggle" id="userMenu"
                        role="button" data-bs-toggle="dropdown" aria-expanded="false" />
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                        <li><a class="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
                    </ul>
                </div>
                <div v-else>
                    <router-link to="/login"><button type="button"
                            class="btn btn-outline-primary me-2">Login</button></router-link>
                    <router-link to="/register"><button type="button"
                            class="btn btn-primary">Sign-up</button></router-link>
                </div>
            </div>
        </header>
    </div>
</template>


<script>
export default {
    name: "AppHeader",
    data() {
        return {
            isLoggedIn: !!(localStorage.getItem("token") || sessionStorage.getItem("token")),
        };
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            this.isLoggedIn = false;
            this.$router.push("/login");
        },
        checkLoginStatus() {
            this.isLoggedIn = !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
        },
    },
    mounted() {
        // Lắng nghe sự kiện đăng nhập
        this.$root.emitter.on("loginStatusChanged", this.checkLoginStatus);
    },
    beforeUnmount() {
        this.$root.emitter.off("loginStatusChanged", this.checkLoginStatus);
    },
};
</script>





<style scoped>
.custom-link {
    text-decoration: none;
    /* Xóa gạch chân */
}

.custom-link:hover {
    color: #000;
    /* Hoặc bạn có thể thêm màu khi hover nếu cần */
}

/* Tùy chỉnh CSS cho header */
header {
    background-color: #f8f9fa;
    /* Thay đổi màu nền của header */
}

.nav-link {
    transition: color 0.2s;
}

.nav-link:hover {
    color: #0056b3;
    /* Thay đổi màu khi hover */
}

.btn-outline-primary {
    border-color: #007bff;
    /* Màu viền nút Login */
}

.btn-outline-primary:hover {
    background-color: #007bff;
    /* Màu nền khi hover */
    color: white;
    /* Màu chữ khi hover */
}

.btn-primary {
    background-color: #007bff;
    /* Màu nền nút Sign-up */
}

.btn-primary:hover {
    background-color: #0056b3;
    /* Màu nền khi hover */
}
</style>
