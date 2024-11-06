<template>
    <div>
        <h2 class="text-center">Chỉnh sửa đọc giả</h2>

        <!-- Hiển thị lỗi nếu có -->
        <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="updateUser">
            <div class="mb-3">
                <label for="name" class="form-label">Tên đọc giả</label>
                <input type="text" class="form-control" v-model="user.name" id="name" required>
            </div>
            <div class="mb-3">
                <label for="phone" class="form-label">Số điện thoại</label>
                <input type="text" class="form-control" v-model="user.phone" id="phone" required>
            </div>
            <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ</label>
                <input type="text" class="form-control" v-model="user.address" id="address" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" v-model="user.email" id="email" required>
            </div>

            <!-- Trường nhập mật khẩu cũ -->
            <div class="mb-3">
                <label for="oldPassword" class="form-label">Mật khẩu cũ</label>
                <input type="password" class="form-control" v-model="oldPassword" id="oldPassword">
            </div>

            <!-- Trường nhập mật khẩu mới -->
            <div class="mb-3">
                <label for="newPassword" class="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
                <input type="password" class="form-control" v-model="newPassword" id="newPassword">
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật đọc giả</button>
        </form>
    </div>
</template>

<script>
import userService from '@/services/user.service';

export default {
    name: "EditUser",
    data() {
        return {
            user: {
                name: '',
                phone: '',
                address: '',
                email: ''
            },
            oldPassword: '', // Mật khẩu cũ để xác thực trước khi đổi mật khẩu
            newPassword: '',
            errorMessage: '' // Thông báo lỗi
        };
    },
    methods: {
        async fetchUser() {
            try {
                const userId = this.$route.params.id;
                const response = await userService.getById(userId);
                if (response) {
                    this.user = response;
                } else {
                    this.errorMessage = "Không tìm thấy dữ liệu đọc giả";
                }
            } catch (error) {
                this.errorMessage = "Lỗi khi lấy thông tin đọc giả";
                console.error("Lỗi khi lấy thông tin đọc giả:", error);
            }
        },
        async updateUser() {
            try {
                const userId = this.$route.params.id;

                // Tạo dữ liệu cập nhật từ các trường thông tin của người dùng
                const updateData = { ...this.user };

                // Nếu `newPassword` có độ dài lớn hơn 0, yêu cầu nhập mật khẩu cũ để đổi mật khẩu
                if (this.newPassword.length > 0) {
                    console.log("Đây là mật khẩu mới:", this.newPassword);
                    if (this.oldPassword.length === 0) {
                        this.errorMessage = 'Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới';
                        return;
                    }
                    // Thêm trường `oldPassword` và `newPassword` vào dữ liệu cập nhật
                    updateData.oldPassword = this.oldPassword;
                    updateData.password = this.newPassword;
                }

                // Gọi API để cập nhật người dùng
                await userService.update(userId, updateData);

                // Điều hướng về trang danh sách với thông báo thành công
                this.$router.push({ name: 'ListUser', query: { successMessage: 'Đọc giả đã được cập nhật thành công!' } });
            } catch (error) {
                // Kiểm tra lỗi trả về từ backend và hiển thị thông báo
                if (error.response && error.response.data && error.response.data.message) {
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = "Lỗi không xác định khi cập nhật đọc giả";
                    console.error("Lỗi khi cập nhật đọc giả:", error);
                }
            }
        }

    },
    created() {
        this.fetchUser();
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
