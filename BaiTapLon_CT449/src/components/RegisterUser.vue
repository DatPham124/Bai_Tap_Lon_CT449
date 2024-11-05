<template>
    <div class="container mt-5">
        <main class="form-signin w-100 m-auto">
            <form @submit.prevent="register">
                <!-- Tiêu đề đăng nhập -->
                <h2 class="h3 mb-3 fw-normal text-center">Register</h2>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingName" placeholder="name" v-model="name"
                        required>
                    <label for="floatingName">Name</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingPhone" placeholder="phone" v-model="phone"
                        required>
                    <label for="floatingPhone">Phone</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingAddress" placeholder="address" v-model="address"
                        required>
                    <label for="floatingAddress">Address</label>
                </div>

                <!-- Email input -->
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com"
                        v-model="email" required>
                    <label for="floatingEmail">Email address</label>
                </div>

                <!-- Password input -->
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                        v-model="password" required>
                    <label for="floatingPassword">Password</label>
                </div>

                <div class="text-center">
                    <p>Already have account <router-link to="/login">Sign in</router-link></p>
                </div>
                <!-- Submit button -->
                <button class="btn btn-primary w-100 py-2" type="submit">Register</button>

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
            name: '',
            phone: '',
            address: '',
            email: '',
            password: '',
            message: ''
        };
    },
    methods: {
        async register() {
            try {
                const res = await axios.post('http://localhost:3000/api/auth/register/user', {
                    name: this.name,
                    phone: this.phone,
                    address: this.address,
                    email: this.email,
                    password: this.password
                });
                this.message = res.data.message;
            } catch (err) {
                this.message = err.response ? err.response.data.error : "An error occurred during registration.";
            }
        }
    }
};
</script>

<style scoped>
/* Thêm các tùy chỉnh CSS cho mẫu đăng ký tại đây */
</style>
