<template>
    <div>
        <h2 class="text-center">Chỉnh sửa tác giả</h2>

        <form @submit.prevent="updateAuthor">
            <div class="mb-3">
                <label for="authorName" class="form-label">Tên tác giả</label>
                <input type="text" class="form-control" v-model="author.AuthorName" id="authorName" required>
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật tác giả</button>
        </form>
    </div>
</template>

<script>
import AuthorService from '@/services/author.service';

export default {
    name: "EditAuthor",
    data() {
        return {
            author: {
                AuthorName: '' // Chỉ lưu tên tác giả
            }
        };
    },
    methods: {
        async fetchAuthor() {
            try {
                const authorId = this.$route.params.id;
                const response = await AuthorService.getById(authorId);
                if (response) {
                    this.author = response; // Gán dữ liệu tác giả vào `author`
                } else {
                    console.error("Không tìm thấy dữ liệu tác giả");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin tác giả:", error);
            }
        },
        async updateAuthor() {
            try {
                const authorId = this.$route.params.id;
                await AuthorService.update(authorId, this.author);
                this.$router.push({ name: 'ListAuthor', query: { successMessage: 'Tác giả đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật tác giả:", error);
            }
        }
    },
    created() {
        this.fetchAuthor(); // Lấy thông tin tác giả khi component được tạo
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
