import { useEffect, useState, useCallback } from 'react';
import styles from './CartItem.module.scss';
import classNames from 'classnames/bind';
import * as ProductsService from '~/services/ProductsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { removeFromCart, updateCartItemQuantity } from '~/services/CartUtils';

const cx = classNames.bind(styles);

function CartItem({ item, removeItem = null }) {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(item.quantity);
    const [qtyChange, setQtyChange] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await ProductsService.getProduct(item.id);
                setProduct(result || null);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProduct();
    }, [item.id]);

    const handleRemoveItem = useCallback(async (e) => {
        e.preventDefault();

        try {
            await removeFromCart(product.id, item.color, item.size);
            removeItem(product.id, item.color, item.size);
        } catch (err) {
            console.error(err);
        }
    }, [product, item.color, item.size, removeItem]);

    const updateCart = useCallback(async () => {
        if (qtyChange === 0) return;

        try {
            if (qty > 0) {
                await updateCartItemQuantity(product.id, item.color, item.size, qtyChange);
            } else {
                await removeFromCart(product.id, item.color, item.size);
                removeItem(product.id, item.color, item.size);
            }
            setQtyChange(0);
        } catch (err) {
            console.error(err);
        }
    }, [qtyChange, qty, product, item.color, item.size, removeItem]);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateCart();
        }, 500);

        return () => clearTimeout(timer);
    }, [qtyChange, updateCart]);

    const handleQtyChange = useCallback((change) => {
        setQty((prevQty) => {
            const newQty = Math.max(0, prevQty + change);
            setQtyChange((prev) => prev + change);
            return newQty;
        });
    }, []);

    useEffect(() => {
        if (qty === 0) {
            handleRemoveItem(new Event('remove'));
        }
    }, [qty, handleRemoveItem]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className={cx('item')}>
            <div className={cx('img_product')}>
                <img src={product.image} alt={product.title} />
            </div>
            <div className={cx('info_product')}>
                <p className={cx('title')}>{product.title}</p>
                <p className={cx('price')}>{`${product.price.toLocaleString()} VND`}</p>
            </div>
            <div className={cx('qty')}>
                <button className={cx('btn_qty', 'minus')} onClick={() => handleQtyChange(-1)}>
                    <FontAwesomeIcon icon={faMinusSquare} />
                </button>
                <input
                    className={cx('qty_input')}
                    type="text"
                    min="0"
                    value={qty}
                    readOnly
                />
                <button className={cx('btn_qty', 'plus')} onClick={() => handleQtyChange(1)}>
                    <FontAwesomeIcon icon={faPlusSquare} />
                </button>
            </div>
            <button className={cx('delete')} onClick={handleRemoveItem}>
                <FontAwesomeIcon icon={faClose} />
            </button>
        </div>
    );
}

export default CartItem;