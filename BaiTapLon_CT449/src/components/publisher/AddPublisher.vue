<template>
    <div>
        <h2 class="text-center">Thêm nhà xuất bản mới</h2>
        <!-- Hiển thị thông báo lỗi nếu có -->
        <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
        </div>

        <form @submit.prevent="addPublisher">
            <div class="mb-3">
                <label for="publisherName" class="form-label">Tên nhà xuất bản</label>
                <input type="text" class="form-control" v-model="publisher.publisherName" id="publisherName" required />
            </div>

            <div class="mb-3">
                <label for="publisherAddress" class="form-label">Địa chỉ nhà xuất bản</label>
                <input type="text" class="form-control" v-model="publisher.publisherAddress" id="publisherAddress"
                    required />
            </div>

            <button type="submit" class="btn btn-success">Thêm nhà xuất bản</button>
        </form>
    </div>
</template>

<script>
import PublisherService from "@/services/publisher.service";

export default {
    name: "AddPublisher",
    data() {
        return {
            publisher: {
                publisherName: "",
                publisherAddress: "",
            },
            errorMessage: "",
        };
    },
    methods: {
        async addPublisher() {
            try {
                // Gọi API để tạo nhà xuất bản mới
                await PublisherService.create(this.publisher);
                // Chuyển hướng và hiển thị thông báo thành công
                this.$router.push({
                    name: "ListPublisher",
                    query: { successMessage: "Nhà xuất bản đã được thêm thành công!" },
                });
            } catch (error) {
                // Kiểm tra nếu có lỗi trả về từ backend
                if (error.response && error.response.data) {
                    this.errorMessage = "Nhà xuất bản này đã tồn tại";
                } else {
                    this.errorMessage = "Có lỗi xảy ra, vui lòng thử lại sau.";
                }

                console.error("Lỗi khi thêm nhà xuất bản:", error);
            }
        },
    },
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
