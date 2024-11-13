<template>
    <div>
        <h2 class="text-center">Thêm lượt mượn sách mới</h2>

        <form @submit.prevent="createBorrow">
            <!-- Chọn sách -->
            <div class="mb-3">
                <label for="bookId" class="form-label">Tên sách</label>
                <select class="form-control" v-model="borrow.bookId" id="bookId" required>
                    <option disabled value="">Chọn sách</option>
                    <option v-for="book in books" :key="book._id" :value="book._id">
                        {{ book.bookName }}
                    </option>
                </select>
            </div>
            <!-- Ngày mượn -->
            <div class="mb-3">
                <label for="borrowDate" class="form-label">Ngày mượn</label>
                <input type="date" class="form-control" v-model="borrow.borrowDate" id="borrowDate" required>
            </div>

            <!-- Ngày trả -->
            <div class="mb-3">
                <label for="returnDate" class="form-label">Ngày trả</label>
                <input type="date" class="form-control" v-model="borrow.returnDate" id="returnDate" required>
            </div>
            <button type="submit" class="btn btn-primary">Thêm lượt mượn</button>
        </form>
    </div>
</template>

<script>
import BookService from '@/services/book.service';
import BorrowService from '@/services/borrow.service';

export default {
    name: "AddBorrow",
    data() {
        const today = new Date();
        const borrowDate = today.toISOString().split('T')[0];
        const returnDate = new Date(today);
        returnDate.setDate(returnDate.getDate() + 7);

        console.log('User ID:', this.$route.params.id);  // In userId ra console để kiểm tra

        return {
            borrow: {
                bookId: '',
                userId: this.$route.params.id, // Lấy userId từ URL
                staffId: null, // Đặt staffId là null
                borrowDate: borrowDate,
                returnDate: returnDate.toISOString().split('T')[0],
                returned: false
            },
            books: [], // Danh sách sách
        };
    },
    methods: {
        async createBorrow() {
            try {
                const today = new Date().toISOString().split('T')[0];
                if (this.borrow.borrowDate > today) {
                    alert("Ngày mượn không được vượt quá ngày hiện tại.");
                    return;
                }
                if (this.borrow.returnDate && this.borrow.returnDate < this.borrow.borrowDate) {
                    alert("Ngày trả phải sau hoặc bằng ngày mượn.");
                    return;
                }
                // Tạo lượt mượn mới
                await BorrowService.create(this.borrow);
                this.$router.push({ name: 'BorrowBook', query: { successMessage: 'Lượt mượn đã được thêm thành công!' } });
            } catch (error) {
                console.error("Lỗi khi thêm lượt mượn:", error);
            }
        },

        async fetchBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách sách:", error);
            }
        },
    },
    created() {
        this.fetchBooks();
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
