<template>
    <div>
        <h2 class="text-center">Thêm tác giả mới</h2>
        <!-- Hiển thị thông báo lỗi nếu có -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="addAuthor">
            <div class="mb-3">
                <label for="authorName" class="form-label">Tên tác giả</label>
                <input type="text" class="form-control" v-model="author.AuthorName" id="authorName" required />
            </div>

            <button type="submit" class="btn btn-success">Thêm tác giả</button>
        </form>
    </div>
</template>

<script>
import AuthorService from "@/services/author.service";

export default {
    name: "AddAuthor",
    data() {
        return {
            author: {
                AuthorName: "", // Chỉ cần tên tác giả cho tính năng này
            },
            errorMessage: "", // Biến để lưu thông báo lỗi
        };
    },
    methods: {
        async addAuthor() {
            try {
                // Gọi API để tạo tác giả mới
                await AuthorService.create(this.author);
                // Chuyển hướng và hiển thị thông báo thành công
                this.$router.push({
                    name: "ListAuthor",
                    query: { successMessage: "Tác giả đã được thêm thành công!" },
                });
            } catch (error) {
                // Kiểm tra nếu có lỗi trả về từ backend
                if (error.response && error.response.data) {
                    this.errorMessage = "Tác giả này đã tồn tại"
                } else {
                    this.errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau."; // Lỗi tổng quát nếu không nhận được thông báo lỗi từ backend
                }

                console.error("Lỗi khi thêm tác giả:", error);
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
