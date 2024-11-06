<template>
    <div>
        <h2 class="text-center">Chỉnh sửa đọc giả</h2>

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
                email: '',
                password: '' // Chỉ dùng để lấy dữ liệu ban đầu, không hiển thị trên form
            },
            newPassword: '' // Thuộc tính tạm thời để lưu mật khẩu mới
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
                    console.error("Không tìm thấy dữ liệu đọc giả");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin đọc giả:", error);
            }
        },
        async updateUser() {
            try {
                const userId = this.$route.params.id;

                // Nếu `newPassword` không rỗng, đặt mật khẩu mới
                if (this.newPassword) {
                    this.user.password = this.newPassword;
                }

                await userService.update(userId, this.user);

                // Điều hướng về trang danh sách với thông báo thành công
                this.$router.push({ name: 'ListUser', query: { successMessage: 'Đọc giả đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật đọc giả:", error);
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
