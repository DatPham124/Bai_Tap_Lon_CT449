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
                <select class="form-control" v-model="book.authorId" id="authorId" required>
                    <option disabled value="">Chọn tác giả</option>
                    <option v-for="author in authors" :key="author._id" :value="author._id">
                        {{ author.AuthorName }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label for="publicationYear" class="form-label">Năm xuất bản</label>
                <input type="number" class="form-control" v-model="book.publicationYear" id="publicationYear" required>
            </div>

            <div class="mb-3">
                <label for="publisherId" class="form-label">Nhà xuất bản</label>
                <select class="form-control" v-model="book.publisherId" id="publisherId" required>
                    <option disabled value="">Chọn nhà xuất bản</option>
                    <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
                        {{ publisher.publisherName }}
                    </option>
                </select>
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

export default {
    name: "EditBook",
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
                console.log("Đây là id truyền qua:", bookId);
                const response = await BookService.getById(bookId);
                console.log("Đây là đã tìm được:", response);
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
                await BookService.update(bookId, this.book);
                this.$router.push({ name: 'ListBook', query: { successMessage: 'Sách đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật sách:", error);
            }
        },
        async fetchAuthors() {
            try {
                this.authors = await AuthorService.getAll();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            }
        },
        async fetchPublishers() {
            try {
                this.publishers = await PublisherService.getAll();
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
