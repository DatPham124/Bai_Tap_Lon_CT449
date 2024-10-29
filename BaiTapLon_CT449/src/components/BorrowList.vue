<template>
    <div>
        <h1>Danh sách mượn, trả</h1>
        <ul v-if="borrows.length > 0">
            <li v-for="borrow in borrows" :key="borrow._id">
                <p><strong>ID Mượn:</strong> {{ borrow._id }}</p>
                <p><strong>ID Sách:</strong> {{ borrow.bookId }}</p>
                <p><strong>ID Người Dùng:</strong> {{ borrow.userId }}</p>
                <p><strong>ID Nhân Viên:</strong> {{ borrow.staffId }}</p>
                <p><strong>Ngày Mượn:</strong> {{ formatDate(borrow.borrowDate) }}</p>
                <p><strong>Ngày Trả:</strong> {{ formatDate(borrow.returnDate) }}</p>
                <hr />
            </li>
        </ul>
        <p v-else>Không có dữ liệu mượn trả</p>
    </div>
</template>

<script>
import BorrowService from "@/services/borrow.service";

export default {
    name: "BorrowList",
    data() {
        return {
            borrows: [] // Array to hold the borrow records
        };
    },
    async created() {
        try {
            this.borrows = await BorrowService.getAll();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách mượn trả:", error);
        }
    },
    methods: {
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString("vi-VN", options);
        }
    }
};
</script>

<style scoped></style>
