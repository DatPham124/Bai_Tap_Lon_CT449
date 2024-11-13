<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
            <router-link to="/" class="custom-link">
                <h3>Quản lý mượn sách</h3>
            </router-link>

            <nav class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <router-link class="nav-link px-2" to="/books" v-if="role === 'staff'">Sách</router-link>
                <router-link class="nav-link px-2" to="/authors" v-if="role === 'staff'">Tác giả</router-link>
                <router-link class="nav-link px-2" to="/users" v-if="role === 'staff'">Đọc giả</router-link>
                <router-link class="nav-link px-2" to="/publishers" v-if="role === 'staff'">Nhà xuất bản</router-link>
            </nav>

            <div class="col-md-2 text-end">
                <div v-if="isLoggedIn" class="dropdown">
                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        Xin chào, {{ username }}
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="userMenu">
                        <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
                    </ul>
                </div>
                <div v-else>
                    <router-link to="/login"><button type="button"
                            class="btn btn-outline-primary me-2">Login</button></router-link>
                    <router-link to="/register/user"><button type="button"
                            class="btn btn-primary">Sign-up</button></router-link>
                </div>
            </div>
        </header>
    </div>
</template>

<script>
import { getUserInfo, getUserRole } from "@/services/auth.service";

export default {
    name: "AppHeader",
    data() {
        return {
            isLoggedIn: !!(localStorage.getItem("token") || sessionStorage.getItem("token")),
            role: null,
            username: ""
        };
    },
    methods: {
        logout() {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            this.isLoggedIn = false;
            this.role = null;
            this.$router.push("/login");
        },
        async checkLoginStatus() {
            this.isLoggedIn = !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
            if (this.isLoggedIn) {
                this.role = getUserRole();
                const userInfo = await getUserInfo();
                this.username = userInfo.username;
            }
        },
    },
    mounted() {
        this.checkLoginStatus();
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
}
</style>
