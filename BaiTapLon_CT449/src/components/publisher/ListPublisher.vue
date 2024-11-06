<template>
    <div>
        <h2 class="text-center">Danh sách nhà xuất bản</h2>

        <!-- Thông báo thành công nếu có -->
        <div v-if="successMessage" class="alert alert-success">
            {{ successMessage }}
        </div>

        <div class="d-flex justify-content-end mb-3">
            <router-link to="/publishers/add">
                <button class="btn btn-success btn-sm">
                    <i class="fas fa-plus"></i> Thêm nhà xuất bản
                </button>
            </router-link>
        </div>

        <!-- Hiển thị danh sách nhà xuất bản nếu có -->
        <div v-if="publishers && publishers.length">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tên nhà xuất bản</th>
                        <th scope="col">Địa chỉ nhà xuất bản</th>
                        <th scope="col">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(publisher, index) in publishers" :key="publisher._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ publisher.publisherName }}</td>
                        <td>{{ publisher.publisherAddress }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2"
                                @click="editPublisher(publisher._id)">Sửa</button>
                            <button class="btn btn-sm btn-danger" @click="deletePublisher(publisher._id)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Thông báo khi không có nhà xuất bản nào -->
        <div v-else>
            <p class="text-center">Không có nhà xuất bản nào để hiển thị.</p>
        </div>
    </div>
</template>

<script>
import publisherService from '@/services/publisher.service';

export default {
    name: "ListPublisher",
    data() {
        return {
            publishers: [], // Mảng lưu danh sách nhà xuất bản
            successMessage: this.$route.query.successMessage || '' // Lấy thông báo thành công từ query
        };
    },
    async mounted() {
        this.fetchPublishers(); // Lấy danh sách nhà xuất bản khi component được mount
    },

    watch: {
        // Cập nhật successMessage khi route thay đổi
        '$route.query.successMessage'(newMessage) {
            this.successMessage = newMessage;
        },
    },

    methods: {
        async fetchPublishers() {
            try {
                this.publishers = await publisherService.getAll(); // Gọi API để lấy dữ liệu nhà xuất bản
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà xuất bản:", error);
            }
        },
        editPublisher(id) {
            // Chuyển hướng tới trang sửa nhà xuất bản với ID nhà xuất bản
            this.$router.push({ name: 'EditPublisher', params: { id: id } });
        },
        async deletePublisher(id) {
            if (confirm("Xóa nhà xuất bản sẽ xóa sách liên quan đến nhà xuất bản đó. Bạn có chắc chắn?")) {
                try {
                    await publisherService.delete(id); // Xóa nhà xuất bản qua API
                    await this.fetchPublishers(); // Cập nhật danh sách nhà xuất bản
                } catch (error) {
                    console.error("Lỗi khi xóa nhà xuất bản:", error);
                }
            }
        }
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
