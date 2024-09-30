import * as request from '~/utils/httpRequest';

export const getCart = async (username) => {
    try {
        const response = await request.get(`cart?username=${username}`);

        return response;
    } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
    }
};

export const updateOrAddToCart = async (username, productId, color, size, quantity) => {

    try {
        const response = await request.put('cart', { 
            username, 
            product_id: productId, 
            color, 
            size, 
            quantity 
        });
        return response;
    } catch (error) {
        console.error('Error updating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const removeFromCart = async (username, productId, color, size, quantity = null) => {

    try {
        const response = await request.del('cart', { 
            data: { 
                username, 
                product_id: productId, 
                color, 
                size, 
                quantity 
            } 
        });
        console.log(response);
        return response;
        
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
};