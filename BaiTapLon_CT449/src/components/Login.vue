<template>
    <div class="container mt-5">
        <main class="form-signin w-100 m-auto">
            <form @submit.prevent="login">
                <!-- Tiêu đề đăng nhập -->
                <h2 class="h3 mb-3 fw-normal text-center">Sign in</h2>

                <!-- Email input -->
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"
                        v-model="email" required>
                    <label for="floatingInput">Email address</label>
                </div>

                <!-- Password input -->
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                        v-model="password" required>
                    <label for="floatingPassword">Password</label>
                </div>

                <!-- Remember me checkbox -->
                <div class="form-check text-start my-3">
                    <input class="form-check-input" type="checkbox" v-model="rememberMe" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                        Remember me
                    </label>
                </div>

                <div class="text-center">
                    <p>Not a member? <router-link to="/register">Register</router-link></p>
                </div>

                <!-- Submit button -->
                <button class="btn btn-primary w-100 py-2" type="submit">Sign in</button>

                <!-- Message display -->
                <p v-if="message" class="mt-3 text-center"
                    :class="{ 'text-success': success, 'text-danger': !success }">
                    {{ message }}
                </p>

                <!-- Copyright -->
                <p class="mt-5 mb-3 text-muted text-center">&copy; 2017–2024</p>
            </form>
        </main>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            rememberMe: false, // Thêm biến rememberMe
            message: '', // Biến để lưu thông báo
            success: false // Trạng thái thông báo thành công/thất bại
        };
    },
    methods: {
        async login() {
            try {
                const res = await axios.post('http://localhost:3000/api/auth/login', {
                    email: this.email,
                    password: this.password
                });

                // Lưu token vào localStorage hoặc sessionStorage
                if (this.rememberMe) {
                    localStorage.setItem('token', res.data.token);
                } else {
                    sessionStorage.setItem('token', res.data.token);
                }

                // Phát sự kiện thông báo đăng nhập thành công
                this.$root.emitter.emit("loginStatusChanged");

                // Hiển thị thông báo thành công
                this.success = true;
                this.message = "Login successful!";

                // Chuyển hướng đến trang chủ
                this.$router.push("/");
            } catch (err) {
                // Hiển thị thông báo lỗi
                this.success = false;
                this.message = err.response ? err.response.data.error : "Login failed";
            }
        }
    }
};
</script>


<style scoped>
/* Thêm các tùy chỉnh CSS cho mẫu đăng nhập tại đây */
</style>
