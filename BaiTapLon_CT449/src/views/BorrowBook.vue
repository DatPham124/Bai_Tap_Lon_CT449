<script>
import BorrowList from "@/components/borrow/BorrowList.vue";

export default {
    name: "BorrowBook", // Đổi tên component cha
    components: {
        BorrowList,
    }
};

</script>

<template>
    <div>
        <BorrowList />
    </div>
</template>
