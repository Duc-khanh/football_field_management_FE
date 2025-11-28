import axios from 'axios';

// Tạo một "instance" axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8080', // API gốc của Spring Boot
});

// Tự động GẮN VÉ (TOKEN) vào mọi request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy token từ kho (localStorage)
        const token = localStorage.getItem('jwtToken');
        
        if (token) {
            // Nếu có token, gắn nó vào header "Authorization"
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi
        return Promise.reject(error);
    }
);

export default apiClient;