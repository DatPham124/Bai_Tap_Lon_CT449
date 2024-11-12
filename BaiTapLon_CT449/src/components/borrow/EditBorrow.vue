<template>
    <div>
        <h2 class="text-center">Chỉnh sửa lượt mượn sách</h2>

        <form @submit.prevent="updateBorrow">
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

            <button type="submit" class="btn btn-primary">Cập nhật lượt mượn</button>
        </form>
    </div>
</template>

<script>
import BookService from '@/services/book.service';
import UserService from '@/services/user.service';
import StaffService from '@/services/staff.service';
import BorrowService from '@/services/borrow.service';

export default {
    name: "EditBorrow",
    data() {
        return {
            borrow: {
                bookId: '',
                userId: '',
                staffId: '',
                borrowDate: '',
                returnDate: '',
                returned: false
            },
            books: [], // Danh sách sách
            users: [], // Danh sách người mượn
            staffs: [] // Danh sách nhân viên
        };
    },
    methods: {
        async fetchBorrow() {
            try {
                const borrowId = this.$route.params.id;
                const response = await BorrowService.getById(borrowId);
                if (response) {
                    this.borrow = {
                        ...response,
                        borrowDate: response.borrowDate ? new Date(response.borrowDate).toISOString().split('T')[0] : '',
                        returnDate: response.returnDate ? new Date(response.returnDate).toISOString().split('T')[0] : ''
                    };
                } else {
                    console.error("Không tìm thấy thông tin lượt mượn");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin lượt mượn:", error);
            }
        },
        async updateBorrow() {
            try {
                const borrowId = this.$route.params.id;
                await BorrowService.update(borrowId, this.borrow);
                this.$router.push({ name: 'BorrowBook', query: { successMessage: 'Lượt mượn đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật lượt mượn:", error);
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
        this.fetchBorrow();
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
