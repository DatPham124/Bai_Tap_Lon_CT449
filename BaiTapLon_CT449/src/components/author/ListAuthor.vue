<template>
    <div>
        <h2 class="text-center">Danh sách tác giả</h2>

        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <div class="d-flex justify-content-end mb-3">
            <router-link to="/authors/add">
                <button class="btn btn-success btn-sm">
                    <i class="fas fa-plus"></i> Thêm tác giả
                </button>
            </router-link>
        </div>

        <div v-if="authors && authors.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên tác giả</th>
                        <th scope="col">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(author, index) in authors" :key="author._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ author.AuthorName }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2" @click="editAuthor(author._id)">Sửa</button>
                            <button class="btn btn-sm btn-danger" @click="deleteAuthor(author._id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-center">Không có tác giả nào để hiển thị.</p>
        </div>
    </div>
</template>

<script>
import AuthorService from '@/services/author.service';

export default {
    name: "ListAuthor",
    data() {
        return {
            authors: [], // Mảng để lưu trữ danh sách tác giả
            successMessage: this.$route.query.successMessage || '' // Lấy thông báo thành công từ query
        };
    },
    async mounted() {
        this.fetchAuthors(); // Gọi hàm để lấy danh sách tác giả khi component được mount
    },

    watch: {
        '$route.query.successMessage'(newMessage) {
            this.successMessage = newMessage;
            console.log("Đây là thông báo: ", this.successMessage);
        },
    },

    methods: {
        async fetchAuthors() {
            try {
                this.authors = await AuthorService.getAll(); // Lấy dữ liệu từ API
                console.log("Đây là danh sách tác giả: ", this.authors);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            }
        },
        editAuthor(id) {
            // Chuyển hướng tới trang sửa tác giả với ID của tác giả
            this.$router.push({ name: 'EditAuthor', params: { id: id } });
        },
        async deleteAuthor(id) {
            if (confirm("Xóa tác giả sẽ xóa sách liên quan đến tác giả đó ?")) {
                try {
                    await AuthorService.delete(id); // Gọi hàm xóa tác giả từ AuthorService
                    await this.fetchAuthors(); // Gọi lại fetchAuthors để cập nhật danh sách từ server
                } catch (error) {
                    console.error("Lỗi khi xóa tác giả:", error);
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
