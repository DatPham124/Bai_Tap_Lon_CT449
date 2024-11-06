<template>
    <div>
        <h2 class="text-center">Quản lý Đọc giả</h2>

        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <div class="d-flex justify-content-end mb-3">
            <router-link to="/users/add">
                <button class="btn btn-success btn-sm">
                    <i class="fas fa-plus"></i> Thêm đọc giả
                </button>
            </router-link>
        </div>

        <div v-if="users && users.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên đọc giả</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Email</th>
                        <th scope="col">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ user.name }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.address }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2" @click="editUser(user._id)">Sửa</button>
                            <button class="btn btn-sm btn-danger" @click="deleteUser(user._id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-center">Không có đọc giả nào để hiển thị.</p>
        </div>
    </div>
</template>

<script>
import userService from '@/services/user.service';

export default {
    name: "ListUser",
    data() {
        return {
            users: [],
            successMessage: this.$route.query.successMessage || ''
        };
    },
    async mounted() {
        this.fetchUsers();
    },

    watch: {
        '$route.query.successMessage'(newMessage) {
            this.successMessage = newMessage;
        }
    },

    methods: {
        async fetchUsers() {
            try {
                this.users = await userService.getAll();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đọc giả:", error);
            }
        },
        editUser(id) {
            this.$router.push({ name: 'EditUser', params: { id: id } });
        },
        async deleteUser(id) {
            if (confirm("Xóa đọc giả sẽ xóa lịch sử mược sách của đoc giả đó. Bạn có chắc chắn ?")) {
                try {
                    await userService.delete(id);
                    this.users = this.users.filter(user => user._id !== id);
                } catch (error) {
                    console.error("Lỗi khi xóa đọc giả:", error);
                }
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
