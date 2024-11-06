<script>
import PublisherList from "@/components/publisher/ListPublisher.vue";

export default {
    name: "PublisherBook", // Đổi tên component cha
    components: {
        PublisherList,
    }
};

</script>

<template>
    <div>
        <PublisherList />
    </div>
</template>
