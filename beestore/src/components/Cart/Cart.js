import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import CartItem from './CartItem/CartItem';
import * as CartService from '~/services/CartService';
import { getUser, removeFromCart } from '~/services/CartUtils';
import { Link } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

function Cart() {
    const [carts, setCarts] = useState([]);
    const [username, setUsername] = useState('');

    const removeItem = (id, color, size) => {
        setCarts((prevCarts) => prevCarts.filter((item) => !(item.id === id && item.color === color && item.size === size)));
    };

    const handleRemoveItem = async (product) => {
        try {
            await removeFromCart( product.id, product.color, product.size)
            removeItem(product.id, product.color, product.size)
        } catch (err) {
            console.log(err);
        }
    }

    const handleRemoveAllItems = () => {
        carts.forEach((item) => {
            handleRemoveItem(item)
        })
    }

    useEffect(() => {
        const user = getUser();
        if (user) {
            setUsername(user);
        }

        const fetchCart = async () => {
            try {
                if (username) {
                    const response = await CartService.getCart(username);
                    const products = response?.products || [];
                    setCarts(products);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();

    }, [username]);

    return (
        <div className={cx('cart')}>
            <div className={cx('cart_content')}>
                <h2 className={cx('title')}>Giỏ hàng</h2>
                {!username ? (
                    <h4>Hãy đăng nhập</h4>
                ) : carts.length > 0 ? (
                    carts.map((item) => (
                        <Link key={`${item.id}-${item.color}-${item.size}`} to={config.routes.productById.replace(':id', item.id)}>
                            <CartItem
                                item={item}
                                removeItem={removeItem}
                            />
                        </Link>
                    ))
                ) : (
                    <h4 className={cx('no_products')}>Giỏ hàng trống</h4>
                )}
            </div>
            <div className={cx('option_cart')}>
                <button className={cx('btn', 'delete')}
                    onClick={handleRemoveAllItems}
                >Xóa hết</button>
                <Link to={config.routes.Cart}>
                    <button className={cx('btn', 'checkout')}>Thanh Toán</button>
                </Link>
            </div>
        </div>
    );
}

export default Cart;