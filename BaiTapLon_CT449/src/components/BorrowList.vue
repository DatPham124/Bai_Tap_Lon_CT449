<template>
    <div>
        <h1>Danh sách Mượn Trả</h1>
        <ul>
            <li v-for="borrow in borrows" :key="borrow._id">
                {{ borrow.bookId }} - {{ borrow.userId }}
                <!-- Nút để lấy chi tiết cho từng borrow -->
                <button @click="fetchBorrowDetails(borrow._id)">Xem chi tiết</button>
            </li>
        </ul>

        <!-- Hiển thị chi tiết nếu có -->
        <div v-if="borrowDetails">
            <h2>Chi tiết Mượn</h2>
            <p><strong>Book name:</strong> {{ borrowDetails[0].bookDetails.bookName }}</p>
        </div>
    </div>
</template>

<script>
import borrowService from '@/services/borrow.service';

export default {
    data() {
        return {
            borrows: [],
            borrowDetails: null, // Để lưu chi tiết của borrow
        };
    },
    async created() {
        try {
            const borrowList = await borrowService.getAll();
            console.log("Borrow List:", borrowList);
            this.borrows = borrowList;
        } catch (error) {
            console.error("Lỗi:", error.message);
        }
    },
    methods: {
        async fetchBorrowDetails(id) {
            try {
                const details = await borrowService.getBorrowsWithDetails(id);
                console.log("Borrow Details:", details); // Kiểm tra chi tiết mượn
                this.borrowDetails = details; // Lưu chi tiết vào biến
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết mượn:", error.message);
            }
        },
    },
};
</script>
