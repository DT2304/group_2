import * as request from '~/utils/httpRequest';

export const getProducts = async () => {
    try {
        const res = await request.get(`products`);
        return res; 
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getProduct = async (product_id) => {
    try {
        const res = await request.get(`products/${product_id}`);
        return res; 
    } catch (error) {
        console.error('Error fetching product:', error);
        return null; 
    }
};