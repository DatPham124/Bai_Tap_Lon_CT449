<template>
    <div>
        <h2 class="text-center">Danh mục sách</h2>

        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <div class="d-flex justify-content-end mb-3">
            <router-link to="/book/addbook">
                <button class="btn btn-success btn-sm">
                    <i class="fas fa-plus"></i> Thêm sách
                </button>
            </router-link>
        </div>
        <div v-if="books && books.length">


            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Tác giả</th>
                        <th scope="col">Năm xuất bản</th>
                        <th scope="col">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(book, index) in books" :key="book.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ book.bookName }}</td>
                        <td>{{ book.authorId.AuthorName }}</td>
                        <td>{{ book.publicationYear }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2" @click="editBook(book._id)">Sửa</button>
                            <button class="btn btn-sm btn-danger" @click="deleteBook(book._id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p class="text-center ">Không có sách nào để hiển thị.</p>
        </div>
    </div>
</template>

<script>
import BookService from '@/services/book.service';

export default {
    name: "ListBook",
    data() {
        return {
            books: [], // Mảng để lưu trữ danh sách sách
            successMessage: this.$route.query.successMessage || '' // Lấy thông báo thành công từ query

        };
    },
    async mounted() {
        this.fetchBooks(); // Gọi hàm để lấy danh sách sách khi component được mount
    },

    watch: {

        '$route.query.successMessage'(newMessage) {
            this.successMessage = newMessage;
            console.log("Đây là thông báo: ", this.successMessage);
        },
    },

    methods: {

        async fetchBooks() {
            try {
                this.books = await BookService.getAll(); // Lấy dữ liệu từ API
                console.log("Đây là danh sách sách: ", this.book);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sách:", error);
            }
        },
        editBook(id) {
            // Chuyển hướng tới trang sửa sách với ID của sách
            this.$router.push({ name: 'EditBook', params: { id: id } });
        },
        async deleteBook(id) {
            if (confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
                try {
                    await BookService.delete(id); // Gọi hàm xóa sách từ BookService
                    await this.fetchBooks(); // Gọi lại fetchBooks để cập nhật danh sách từ server
                } catch (error) {
                    console.error("Lỗi khi xóa sách:", error);
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
