<template>
    <div class="container mt-5">
        <main class="form-signin w-100 m-auto">
            <form @submit.prevent="registerUser">
                <h2 class="h3 mb-3 fw-normal text-center">Register New User</h2>

                <!-- Error or Success Message -->
                <div v-if="errorMessage" class="alert alert-danger mt-3">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="alert alert-success mt-3">
                    {{ successMessage }}
                </div>

                <!-- Name input -->
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingName" placeholder="Name" v-model="user.name"
                        required />
                    <label for="floatingName">Name</label>
                </div>

                <!-- Phone input -->
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingPhone" placeholder="Phone" v-model="user.phone"
                        required />
                    <label for="floatingPhone">Phone</label>
                </div>

                <!-- Address input -->
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="floatingAddress" placeholder="Address"
                        v-model="user.address" required />
                    <label for="floatingAddress">Address</label>
                </div>

                <!-- Email input -->
                <div class="form-floating mb-3">
                    <input type="email" class="form-control" id="floatingEmail" placeholder="Email" v-model="user.email"
                        required />
                    <label for="floatingEmail">Email address</label>
                </div>

                <!-- Password input -->
                <div class="form-floating mb-3">
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password"
                        v-model="user.password" required />
                    <label for="floatingPassword">Password</label>
                </div>

                <!-- Submit Button -->
                <button class="btn btn-primary w-100 py-2" type="submit">Register</button>

                <!-- Redirect to login link -->
                <div class="text-center mt-3">
                    <p>Already have an account? <router-link to="/login">Sign in</router-link></p>
                </div>

                <!-- Copyright -->
                <p class="mt-5 mb-3 text-muted text-center">&copy; 2017–2024</p>
            </form>
        </main>
    </div>
</template>

<script>
import userService from "@/services/user.service";

export default {
    name: "RegisterUser",
    data() {
        return {
            user: {
                name: "",
                phone: "",
                address: "",
                email: "",
                password: ""
            },
            errorMessage: "",
            successMessage: ""
        };
    },
    methods: {
        async registerUser() {
            try {
                await userService.create(this.user);
                this.successMessage = "User registered successfully! Redirecting to login.";
                setTimeout(() => {
                    this.$router.push({ name: "login" });
                }, 2000);
            } catch (error) {
                this.errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
                console.error("Registration error:", error);
            }
        }
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
