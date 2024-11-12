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

            <!-- Chọn người dùng -->
            <div class="mb-3">
                <label for="userId" class="form-label">Người mượn</label>
                <select class="form-control" v-model="borrow.userId" id="userId" required>
                    <option disabled value="">Chọn người mượn</option>
                    <option v-for="user in users" :key="user._id" :value="user._id">
                        {{ user.name }}
                    </option>
                </select>
            </div>

            <!-- Chọn nhân viên xử lý -->
            <div class="mb-3">
                <label for="staffId" class="form-label">Nhân viên xử lý</label>
                <select class="form-control" v-model="borrow.staffId" id="staffId" required>
                    <option disabled value="">Chọn nhân viên</option>
                    <option v-for="staff in staffs" :key="staff._id" :value="staff._id">
                        {{ staff.name }}
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

            <!-- Trạng thái trả sách -->
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" v-model="borrow.returned" id="returned">
                <label class="form-check-label" for="returned">Đã trả sách</label>
            </div>

            <button type="submit" class="btn btn-primary">Thêm lượt mượn</button>
        </form>
    </div>
</template>

<script>
import BookService from '@/services/book.service';
import UserService from '@/services/user.service';
import StaffService from '@/services/staff.service';
import BorrowService from '@/services/borrow.service';

export default {
    name: "AddBorrow",
    data() {
        // Tính ngày hiện tại và ngày trả mặc định (7 ngày sau ngày mượn)
        const today = new Date();
        const borrowDate = today.toISOString().split('T')[0];
        const returnDate = new Date(today);
        returnDate.setDate(returnDate.getDate() + 7);

        return {
            borrow: {
                bookId: '',
                userId: '',
                staffId: '',
                borrowDate: borrowDate,
                returnDate: returnDate.toISOString().split('T')[0],
                returned: false
            },
            books: [], // Danh sách sách
            users: [], // Danh sách người mượn
            staffs: [] // Danh sách nhân viên
        };
    },
    methods: {
        async createBorrow() {
            try {
                // Lấy ngày hiện tại
                const today = new Date().toISOString().split('T')[0];

                // Kiểm tra ngày mượn và ngày trả
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
        async fetchUsers() {
            try {
                this.users = await UserService.getAll();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người mượn:", error);
            }
        },
        async fetchStaffs() {
            try {
                this.staffs = await StaffService.getAll();
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhân viên:", error);
            }
        }
    },
    created() {
        this.fetchBooks();
        this.fetchUsers();
        this.fetchStaffs();
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
