import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Products.module.scss';
import '../GlobalStyle/GlobalStyle.module.scss';
import ProductItem from './ProductItem/ProductItem';
import * as ProductsService from '~/services/ProductsService';
import * as CartService from '~/services/CartService'; // Giả sử bạn có service này
import CartPopup from '../Cart/Cart';

const cx = classNames.bind(styles);

function Products() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [username, setUsername] = useState(''); // Thay thế bằng logic xác thực thực tế

    const getUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser); // parse JSON string thành object
            return parsedUser?.username || ''; // Lấy username từ object user
        }
        return '';
    };

    useEffect(() => {
        const user = getUser();
        setUsername(user);
        const fetchProducts = async () => {
            const result = await ProductsService.getProducts();
            setProducts(result || []);
            console.log(result);
            
        };

        const fetchCart = async () => {
            const result = await CartService.getCart(username);
            setCart(result.products || []);
        };

        fetchProducts();
        if (user) {
            fetchCart();
        }
    }, [username]);

    const addToCart = async (product) => {
        try {
            await CartService.updateOrAddToCart(username, product.id, 1);
            const updatedCart = await CartService.getCart(username);
            setCart(updatedCart.products || []);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateCartItemQuantity = async (productId, quantity) => {
        try {
            await CartService.updateOrAddToCart(username, productId, quantity);
            const updatedCart = await CartService.getCart(username);
            setCart(updatedCart.products || []);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await CartService.removeFromCart(username, productId);
            const updatedCart = await CartService.getCart(username);
            setCart(updatedCart.products || []);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <div>
            <div className={cx("products")}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductItem
                            key={product.id}
                            data={product}
                            addToCart={addToCart}
                        />
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>
            <CartPopup
                items={cart}
                updateQuantity={updateCartItemQuantity}
                removeItem={removeFromCart}
            />
        </div>
    );
}

export default Products;