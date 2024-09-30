import * as CartService from '~/services/CartService';

export const getUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const userObject = JSON.parse(storedUser);
        return userObject.username || '';
    }
    return '';
};

export const addToCart = async (product, color, size, qty = 1) => {
    const username = getUser();
    if (!username) return;
    console.log(product, color, size, qty);

    try {
        await CartService.updateOrAddToCart(username, product.id, color, size, qty);
        const updatedCart = await CartService.getCart(username);
        return updatedCart && updatedCart.products ? updatedCart.products : [];
    } catch (error) {
        console.error('Error adding to cart:', error);
        return error;
    }
};

export const updateCartItemQuantity = async (productId, color, size, qty) => {
    const username = getUser();
    if (!username) return;

    try {
        await CartService.updateOrAddToCart(username, productId, color, size, qty);
        const updatedCart = await CartService.getCart(username);
        return updatedCart.products || [];
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        return error;
    }
};

export const removeFromCart = async (productId, color, size, quantity = null) => {
    const username = getUser();
    if (!username) return;


    try {
        await CartService.removeFromCart(username, productId, color, size, quantity);
        const updatedCart = await CartService.getCart(username);
        return updatedCart.products || [];
    } catch (error) {
        console.error('Error removing from cart:', error);
        return error;
    }
};