import * as request from '~/utils/httpRequest';

export const postLogIn = async (username, password) => {
    try {
        const res = await request.post(`login`,{
            username,
            password
          });
        return res; // Đảm bảo rằng res.data chứa dữ liệu bạn mong đợi
    } catch (error) {
        console.error('Error fetching login:', error); // Xử lý lỗi
        throw error; // Hoặc trả về giá trị mặc định
    }
};
