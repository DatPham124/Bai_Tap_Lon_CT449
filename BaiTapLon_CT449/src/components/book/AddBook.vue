<template>
    <div>
        <h2 class="text-center">Thêm sách mới</h2>

        <form @submit.prevent="addBook">
            <div class="mb-3">
                <label for="bookName" class="form-label">Tên sách</label>
                <input type="text" class="form-control" v-model="book.bookName" id="bookName" required>
            </div>

            <!-- Sử dụng select để liệt kê danh sách tác giả -->
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

            <button type="submit" class="btn btn-success">Thêm sách</button>
        </form>
    </div>
</template>

<script>
import BookService from '@/services/book.service';
import AuthorService from '@/services/author.service';
import PublisherService from '@/services/publisher.service';

export default {
    name: "AddBook",
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
        async addBook() {
            try {
                await BookService.create(this.book);
                this.$router.push({ name: 'ListBook', query: { successMessage: 'Sách đã được thêm thành công!' } });
            } catch (error) {
                console.error("Lỗi khi thêm sách:", error);
            }
        },
        async fetchAuthors() {
            try {
                this.authors = await AuthorService.getAll(); // Không cần `response.data`
                console.log("Đây là danh sách tác giả:", this.authors);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách tác giả:", error);
            }
        },
        async fetchPublishers() {
            try {
                this.publishers = await PublisherService.getAll(); // Không cần `response.data`
                console.log("Đây là danh sách nhà xuất bản:", this.publishers);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            }
        }
    },
    created() {
        this.fetchAuthors(); // Gọi khi component được tạo
        this.fetchPublishers(); // Gọi khi component được tạo
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
