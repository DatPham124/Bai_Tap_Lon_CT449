<template>
    <div>
        <h2 class="text-center">Danh sách Mượn Trả</h2>

        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <div class="d-flex justify-content-end mb-3">
            <router-link to="/borrow/add">
                <button v-if='role === "staff"' class="btn btn-success btn-sm" aria-label="Add Borrow Entry">
                    <i class="fas fa-plus"></i> Thêm lượt mượn sách
                </button>
            </router-link>

            <button @click=UserAddBorrow(userId) v-if='role === "user"' class="btn btn-success btn-sm"
                aria-label="Add Borrow Entry">
                <i class="fas fa-plus"></i> Thêm lượt mượn sách
            </button>


        </div>

        <div v-if="borrows && borrows.length">

            <table class="table table-striped" v-if="role === 'staff'">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên người mượn</th>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Hạn trả</th>
                        <th scope="col">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(borrow, index) in borrows" :key="borrow._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ borrow.userDetails.name }}</td>
                        <td>{{ borrow.bookDetails.bookName }}</td>
                        <td>{{ new Date(borrow.returnDate).toLocaleDateString() }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2" @click="editBorrow(borrow._id)"
                                aria-label="Edit Borrow">Sửa</button>
                            <button class="btn btn-sm btn-danger" @click="deleteBorrow(borrow._id)"
                                aria-label="Delete Borrow">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="table table-striped" v-else-if="role === 'user'">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Ngày mượn</th>
                        <th scope="col">Hạn trả</th>
                        <th scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(borrow, index) in borrows" :key="borrow._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ borrow.bookDetails.bookName }}</td>
                        <td>{{ new Date(borrow.borrowDate).toLocaleDateString() }}</td>
                        <td>{{ new Date(borrow.returnDate).toLocaleDateString() }}</td>
                        <td>



                            <div v-if='borrow.returned'>
                                <p class="text-success">Đã trả</p>
                            </div>



                            <div v-else-if="!borrow.returned && !borrow.staffDetails">
                                <p class="text-warning">Chờ duyệt</p>
                            </div>

                            <div v-else-if="!borrow.returned">
                                <p class="text-danger">Chưa trả</p>
                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else>
            <p class="text-center">Không có dữ liệu mượn trả để hiển thị.</p>
        </div>

        <div v-if="borrowDetails">
            <h2>Chi tiết Mượn</h2>
            <p><strong>Tên người mượn:</strong> {{ borrowDetails.userDetails.name }}</p>
            <p><strong>Tên sách:</strong> {{ borrowDetails.bookDetails.bookName }}</p>
            <p><strong>Hạn trả:</strong> {{ new Date(borrowDetails.returnDate).toLocaleDateString() }}</p>
        </div>
    </div>
</template>

<script>
import { getUserInfo } from "@/services/auth.service";
import borrowService from '@/services/borrow.service';

export default {
    data() {
        return {
            borrows: [],
            borrowDetails: null,
            successMessage: '', // Initialize as empty
            role: '',
            userId: '',
        };
    },
    async created() {
        this.successMessage = this.$route.query.successMessage || ''; // Set on component creation
        const user = await getUserInfo();
        this.role = user.role;
        console.log("role:", this.role);
        this.userId = user.userId;
        await this.fetchBorrows();
    },
    watch: {
        '$route.query.successMessage'(newMessage) {
            this.successMessage = newMessage;
            console.log("Thông báo:", this.successMessage);
        },
    },
    methods: {
        async fetchBorrows() {
            try {
                if (this.role === 'staff') {
                    this.borrows = await borrowService.getBorrowsWithDetails();
                    console.log('Day la noi dung:', this.borrows);
                } else {
                    console.log("userId:", this.userId);
                    this.borrows = await borrowService.getBorrowHistoryByUserId(this.userId);
                    console.log('Day la noi dung:', this.borrows);

                }

            } catch (error) {
                console.error("Lỗi khi lấy danh sách mượn trả:", error);
            }
        },
        async deleteBorrow(id) {
            if (confirm("Bạn có chắc chắn muốn xóa lượt mượn sách này không?")) {
                try {
                    await borrowService.delete(id);
                    await this.fetchBorrows();
                } catch (error) {
                    console.error("Lỗi khi xóa lượt mượn:", error);
                }
            }
        },
        editBorrow(id) {
            this.$router.push({ name: 'EditBorrow', params: { id } });
        },

        UserAddBorrow(id) {
            this.$router.push({ name: 'UserAddBorrow', params: { id } });
        },
    },
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
