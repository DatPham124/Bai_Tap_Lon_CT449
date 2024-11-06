<template>
    <div>
        <h2 class="text-center">Thêm đọc giả mới</h2>
        <!-- Hiển thị thông báo lỗi nếu có -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="addUser">
            <div class="mb-3">
                <label for="name" class="form-label">Tên đọc giả</label>
                <input type="text" class="form-control" v-model="user.name" id="name" required />
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" v-model="user.phone" id="phone" required />
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="user.address" id="address" required />
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" v-model="user.email" id="email" required />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="text" class="form-control" v-model="user.password" id="password" required />
            </div>

            <button type="submit" class="btn btn-success">Thêm đọc giả</button>
        </form>
    </div>
</template>

<script>
import userService from "@/services/user.service";

export default {
    name: "AddUser",
    data() {
        return {
            user: {
                name: "",
                phone: "",
                address: "",
                email: "",
                password: ""
            },
            errorMessage: "", // Biến để lưu thông báo lỗi
        };
    },
    methods: {
        async addUser() {
            try {
                // Gọi API để tạo đọc giả mới
                await userService.create(this.user);
                // Chuyển hướng và hiển thị thông báo thành công
                this.$router.push({
                    name: "ListUser",
                    query: { successMessage: "Đọc giả đã được thêm thành công!" },
                });
            } catch (error) {
                // Kiểm tra nếu có lỗi trả về từ backend
                if (error.response && error.response.data) {
                    this.errorMessage = error.response.data.message || "Đọc giả này đã tồn tại";
                } else {
                    this.errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau."; // Lỗi tổng quát nếu không nhận được thông báo lỗi từ backend
                }

                console.error("Lỗi khi thêm đọc giả:", error);
            }
        },
    },
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
