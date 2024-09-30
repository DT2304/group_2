import { useEffect, useState, useCallback } from 'react';
import '~/components/GlobalStyle/GlobalStyle.module.scss'
import styles from './Item.module.scss';
import classNames from 'classnames/bind';
import * as ProductsService from '~/services/ProductsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { removeFromCart, updateCartItemQuantity } from '~/services/CartUtils';

const cx = classNames.bind(styles);

function Item({ item, removeItem = null, isSelected, onSelectChange }) {
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

    const formattedAmount = (number) => {
        return new Intl.NumberFormat('vn-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(number)
    }

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className={cx('item')}>
            <div className={cx('cb_product')}>
                <input 
                    type='checkbox' 
                    className={cx('checkbox')} 
                    checked={isSelected}
                    onChange={(e) => onSelectChange(item.id, item.color, item.size, e.target.checked)}
                />
            </div>
            <div className={cx('img_product')}>
                <img src={product.image} alt={product.title} />
            </div>
            <div className={cx('product-container')}>
                <div className={cx('product-info')}>
                    <p className={cx('product-title')}>{product.title}</p>
                    <p className={cx('product-price')}>{`${formattedAmount(product.price)}`}</p>
                </div>
                <div className={cx('product-details')}>
                    <p className={cx('product-size')}>{`Size : ${item.size}`}</p>
                    <p className={cx('product-color')}>{`Color : ${item.color}`}</p>
                </div>
            </div>
            <div className={cx('qty')}>
                <button className={cx('btn_qty', 'minus')} onClick={() => handleQtyChange(-1)}>
                    <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                    className={cx('qty_input')}
                    type="text"
                    min="0"
                    value={qty}
                    readOnly
                />
                <button className={cx('btn_qty', 'plus')} onClick={() => handleQtyChange(1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            <div className={cx('delete')}>
                <button className={cx('btn-delete')} onClick={handleRemoveItem}>
                    <FontAwesomeIcon icon={faClose} />
                </button>
            </div>
        </div>
    );
}

export default Item;