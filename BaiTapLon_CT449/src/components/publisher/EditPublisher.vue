<template>
    <div>
        <h2 class="text-center">Chỉnh sửa nhà xuất bản</h2>

        <form @submit.prevent="updatePublisher">
            <div class="mb-3">
                <label for="publisherName" class="form-label">Tên nhà xuất bản</label>
                <input type="text" class="form-control" v-model="publisher.publisherName" id="publisherName" required>
            </div>
            <div class="mb-3">
                <label for="publisherAddress" class="form-label">Địa chỉ nhà xuất bản</label>
                <input type="text" class="form-control" v-model="publisher.publisherAddress" id="publisherAddress"
                    required>
            </div>

            <button type="submit" class="btn btn-primary">Cập nhật nhà xuất bản</button>
        </form>
    </div>
</template>

<script>
import PublisherService from '@/services/publisher.service';

export default {
    name: "EditPublisher",
    data() {
        return {
            publisher: {
                publisherName: '', // Chỉ lưu tên nhà xuất bản
                publisherAddress: '' // Địa chỉ nhà xuất bản
            }
        };
    },
    methods: {
        async fetchPublisher() {
            try {
                const publisherId = this.$route.params.id;
                const response = await PublisherService.getById(publisherId);
                if (response) {
                    this.publisher = response; // Gán dữ liệu nhà xuất bản vào `publisher`
                } else {
                    console.error("Không tìm thấy dữ liệu nhà xuất bản");
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin nhà xuất bản:", error);
            }
        },
        async updatePublisher() {
            try {
                const publisherId = this.$route.params.id;
                await PublisherService.update(publisherId, this.publisher);
                this.$router.push({ name: 'ListPublisher', query: { successMessage: 'Nhà xuất bản đã được cập nhật thành công!' } });
            } catch (error) {
                console.error("Lỗi khi cập nhật nhà xuất bản:", error);
            }
        }
    },
    created() {
        this.fetchPublisher(); // Lấy thông tin nhà xuất bản khi component được tạo
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
