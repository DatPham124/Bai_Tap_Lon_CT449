<template>
    <div>
        <h1>Danh sách Mượn Trả</h1>
        <ul>
            <li v-for="borrow in borrows" :key="borrow._id">
                <strong>Tên người mượn:</strong> {{ borrow.userDetails.name }}<br />
                <strong>Tên sách:</strong> {{ borrow.bookDetails.bookName }}<br />
                <strong>Hạn trả:</strong> {{ new Date(borrow.returnDate).toLocaleDateString() }}<br />
                <button @click="fetchBorrowDetails(borrow._id)">Xem chi tiết</button>
            </li>
        </ul>

        <!-- Hiển thị chi tiết nếu có -->
        <div v-if="borrowDetails">
            <h2>Chi tiết Mượn</h2>
            <p><strong>Tên người mượn:</strong> {{ borrowDetails.userDetails.name }}</p>
            <p><strong>Tên sách:</strong> {{ borrowDetails.bookDetails.bookName }}</p>
            <p><strong>Hạn trả:</strong> {{ new Date(borrowDetails.returnDate).toLocaleDateString() }}</p>
        </div>
    </div>
</template>

<script>
const token = localStorage.getItem("token");
console.log(token); // Sẽ in ra token nếu có, hoặc null nếu không có



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
            const borrowList = await borrowService.getBorrowsWithDetails(); // Gọi API để lấy danh sách với chi tiết
            console.log("Borrow List:", borrowList);
            this.borrows = borrowList; // Lưu danh sách vào biến
        } catch (error) {
            console.error("Lỗi:", error.message);
        }
    },
    methods: {
        async fetchBorrowDetails(id) {
            try {
                const details = await borrowService.getById(id); // Lấy chi tiết của mượn theo ID
                console.log("Borrow Details:", details); // Kiểm tra chi tiết mượn
                this.borrowDetails = details; // Lưu chi tiết vào biến
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết mượn:", error.message);
            }
        },
    },
};
</script>
