import * as request from '~/utils/httpRequest';

export const getProducts = async () => {
    try {
        const res = await request.get(`products`);
        console.log(`res ${res} `)
        console.log(res.data)
        return res; // Đảm bảo rằng res.data chứa dữ liệu bạn mong đợi
    } catch (error) {
        console.error('Error fetching products:', error); // Xử lý lỗi
        return []; // Hoặc trả về giá trị mặc định
    }
};
