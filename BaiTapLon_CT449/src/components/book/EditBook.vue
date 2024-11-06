<template>
    <div>
        <h2 class="text-center">Chỉnh sửa sách</h2>

        <form @submit.prevent="updateBook">
            <div class="mb-3">
                <label for="bookName" class="form-label">Tên sách</label>
                <input type="text" class="form-control" v-model="book.bookName" id="bookName" required>
            </div>

            <div class="mb-3">
                <label for="authorId" class="form-label">Tác giả</label>
                <v-select v-model="book.authorId" :options="authors" label="AuthorName" :reduce="author => author._id"
                    placeholder="Chọn hoặc nhập tên tác giả" :filterable="true" @search="fetchAuthors" required />
            </div>

            <div class="mb-3">
                <label for="publicationYear" class="form-label">Năm xuất bản</label>
                <input type="number" class="form-control" v-model="book.publicationYear" id="publicationYear" required>
            </div>

            <div class="mb-3">
                <label for="publisherId" class="form-label">Nhà xuất bản</label>
                <v-select v-model="book.publisherId" :options="publishers" label="publisherName"
                    :reduce="publisher => publisher._id" placeholder="Chọn hoặc nhập nhà xuất bản" :filterable="true"
                    @search="fetchPublishers" required />
            </div>

            <div class="mb-3">
                <label for="numberOfCopies" class="form-label">Số lượng</label>
                <input type="number" class="form-control" v-model="book.numberOfCopies" id="numberOfCopies" required>
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật sách</button>
        </form>
    </div>
</template>

<script>
import BookService from '@/services/book.service';
import AuthorService from '@/services/author.service';
import PublisherService from '@/services/publisher.service';
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default {
    name: "EditBook",
    components: { vSelect },
    data() {
        return {
            book: {
                bookName: '',
                authorId: '',
                publicationYear: null,
                publisherId: '',
                numberOfCopies: '',
            },
            authors: [], // Lưu trữ danh sách tác giả
            publishers: [] // Lưu trữ danh sách nhà xuất bản
        };
    },
    methods: {
        async fetchBook() {
            try {
                const bookId = this.$route.params.id;
                const response = await BookService.getById(bookId);
                if (response) {
                    this.book = response; // Gán dữ liệu sách cần chỉnh sửa vào `book`
                } else {
                    console.error("Không tìm thấy dữ liệu sách");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sách:", error);
            }
        },
        async updateBook() {
            try {
                const bookId = this.$route.params.id;

                // Chỉ lấy các _id của author và publisher
                const bookData = {
                    ...this.book,
                    authorId: this.book.authorId._id,
                    publisherId: this.book.publisherId._id,
                };

                await BookService.update(bookId, bookData);
                this.$router.push({ name: 'ListBook', query: { successMessage: 'Sách đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật sách:", error);
            }
        },

        async fetchAuthors(searchTerm = "") {
            try {
                this.authors = await AuthorService.getAll(searchTerm); // Có thể truyền từ khóa tìm kiếm vào để lọc
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            }
        },
        async fetchPublishers(searchTerm = "") {
            try {
                this.publishers = await PublisherService.getAll(searchTerm); // Có thể truyền từ khóa tìm kiếm vào để lọc
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            }
        }
    },
    created() {
        this.fetchBook(); // Lấy thông tin sách khi component được tạo
        this.fetchAuthors();
        this.fetchPublishers();
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
