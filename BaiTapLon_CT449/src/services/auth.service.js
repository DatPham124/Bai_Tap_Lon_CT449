import { jwtDecode } from "jwt-decode";

export function getUserRole() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role || null; // Trả về role nếu có, hoặc null nếu không có
    } catch (error) {
      console.error("Lỗi khi decode token:", error);
      return null;
    }
  }
  return null;
}

export function getUserInfo() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    try {
      const decode = jwtDecode(token);
      return {
        userId: decode.userId || null,
        username: decode.username || null,
        role: decode.role || null,
      };
    } catch (error) {
      console.error("Lỗi khi decode token:", error);
      return null;
    }
  }
  return null;
}
