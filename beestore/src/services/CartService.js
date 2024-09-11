import * as request from '~/utils/httpRequest';


export const getCart = async (username) => {
    try {
        const response = await request.get(`cart?username=${username}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const updateOrAddToCart = async (username, productId, quantity) => {
    try {
        const response = await request.put(`cart`, { username, product_id: productId, quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error;
    }
};

export const removeFromCart = async (username, productId) => {
    try {
        const response = await request.del(`cart`, { data: { username, product_id: productId } });
        return response.data;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};