import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.scss'
import classNames from 'classnames/bind'
import * as CartService from '~/services/CartService';
import * as ProductsService from '~/services/ProductsService';
import { getUser } from '~/services/CartUtils';
import Item from '~/components/Item/Item';
import config from '~/config';
const cx = classNames.bind(styles)

function Cart() {
    const [products, setProducts] = useState([])
    const [username, setUsername] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)
    const [selectedItems, setSelectedItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const formattedAmount = (number) => {
        return new Intl.NumberFormat('vn-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(number)
    }

    useEffect(() => {
        const user = getUser();
        if (user) {
            setUsername(user);
        }
    }, []);

    useEffect(() => {
        const fetchCartAndProducts = async () => {
            if (!username) return;

            setLoading(true);
            try {
                const cartResponse = await CartService.getCart(username);
                const cartItems = cartResponse?.products || [];

                const productPromises = cartItems.map(item =>
                    ProductsService.getProduct(item.id)
                );
                const productResponses = await Promise.all(productPromises);

                const updatedProducts = cartItems.map((item, index) => ({
                    ...item,
                    ...productResponses[index],
                }));

                setProducts(updatedProducts);
            } catch (error) {
                console.error('Error fetching cart and products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartAndProducts();
    }, [username]);

    const calculateTotal = useCallback(() => {
        const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalAmount(total);
    }, [selectedItems]);

    useEffect(() => {
        calculateTotal();
    }, [calculateTotal]);

    const removeItem = (id, color, size) => {
        setProducts(prevProducts => prevProducts.filter(item =>
            !(item.id === id && item.color === color && item.size === size)
        ));
        setSelectedItems(prevSelected => prevSelected.filter(item =>
            !(item.id === id && item.color === color && item.size === size)
        ));
    };

    const handleSelectChange = (id, color, size, isSelected) => {
        if (isSelected) {
            const itemToAdd = products.find(item =>
                item.id === id && item.color === color && item.size === size
            );
            if (itemToAdd) {
                setSelectedItems(prevSelected => [...prevSelected, itemToAdd]);
            }
        } else {
            setSelectedItems(prevSelected => prevSelected.filter(item =>
                !(item.id === id && item.color === color && item.size === size)
            ));
        }
    }

    const isItemSelected = (id, color, size) => {
        return selectedItems.some(item =>
            item.id === id && item.color === color && item.size === size
        );
    }

    const handleCheckout = () => {
        if (selectedItems.length > 0) {
            const itemsWithCorrectQuantity = selectedItems.map(item => {
                const productInCart = products.find(p =>
                    p.id === item.id && p.color === item.color && p.size === item.size
                );
                return {
                    ...item,
                    quantity: productInCart ? productInCart.quantity : 1
                };
            });
            navigate('/checkout', { state: { selectedItems: itemsWithCorrectQuantity, totalAmount } });
        } else {
            alert('Please select items to checkout');
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={cx('container')}>
            <div className={cx('viewCart')}>
                <div>
                    <h2>Danh Sách hàng Hóa </h2>
                </div>
                <div className={cx('products')}>
                    {
                        products && products.length > 0 ? (
                            products.map(item => (
                                <div className={cx('item')} key={`${item.id}-${item.color}-${item.size}`}>
                                    <Item
                                        item={item}
                                        removeItem={removeItem}
                                        isSelected={isItemSelected(item.id, item.color, item.size)}
                                        onSelectChange={handleSelectChange}
                                    />
                                </div>
                            ))
                        ) : (
                            <p>Giỏ hàng trống</p>
                        )
                    }
                </div>
                <div className={cx('checkout-bar')}>
                    <div className={cx('total-amount')}>
                        <span>Tổng thanh toán ({selectedItems.length} Sản phẩm):</span>
                        <span className={cx('amount')}>{formattedAmount(totalAmount)}</span>
                    </div>
                    <button className={cx('checkout-button')} onClick={handleCheckout}>
                        <Link to={config.routes.checkout}>Mua Hàng</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;