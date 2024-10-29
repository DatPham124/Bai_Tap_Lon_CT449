<template>
    <div>
        <h1>Danh sách người dùng</h1>
        <ul v-if="users.length > 0">
            <li v-for="user in users" :key="user._id">
                {{ user.name }} - {{ user.email }}
            </li>
        </ul>
        <p v-else>Không có người dùng nào</p>
    </div>
</template>

<script>
import UserService from "@/services/user.service";

export default {
    name: "UserList",
    data() {
        return {
            users: [], // Mảng chứa danh sách người dùng
        };
    },
    async created() {
        // Lấy dữ liệu người dùng khi component được tạo
        try {
            this.users = await UserService.getAll();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    },


    name: "UserList",

};

</script>

<style scoped>
/* CSS style nếu cần */
</style>
