<template>
    <div class="container">
        <header class="d-flex flex-wrap align-items-center justify-content-between py-3 mb-4 border-bottom">
            <router-link to="/borrow" class="custom-link">
                <h3>Quản lý mượn sách</h3>
            </router-link>

            <nav class="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <a href="#" class="nav-link px-2">Features</a>
                <a href="#" class="nav-link px-2">Pricing</a>
                <a href="#" class="nav-link px-2">FAQs</a>
                <a href="#" class="nav-link px-2">About</a>
            </nav>

            <div class="col-md-3 text-end">
                <router-link to="/login"><button type="button"
                        class="btn btn-outline-primary me-2">Login</button></router-link>
                <router-link to="/register"><button type="button" class="btn btn-primary">Sign-up</button></router-link>
            </div>
        </header>
    </div>
</template>

<script>
export default {
    name: "AppHeader",
};
</script>

<style scoped>
.custom-link {
    text-decoration: none;
    /* Xóa gạch chân */
}

.custom-link:hover {
    color: #000;
    /* Hoặc bạn có thể thêm màu khi hover nếu cần */
}

/* Tùy chỉnh CSS cho header */
header {
    background-color: #f8f9fa;
    /* Thay đổi màu nền của header */
}

.nav-link {
    transition: color 0.2s;
}

.nav-link:hover {
    color: #0056b3;
    /* Thay đổi màu khi hover */
}

.btn-outline-primary {
    border-color: #007bff;
    /* Màu viền nút Login */
}

.btn-outline-primary:hover {
    background-color: #007bff;
    /* Màu nền khi hover */
    color: white;
    /* Màu chữ khi hover */
}

.btn-primary {
    background-color: #007bff;
    /* Màu nền nút Sign-up */
}

.btn-primary:hover {
    background-color: #0056b3;
    /* Màu nền khi hover */
}
</style>
