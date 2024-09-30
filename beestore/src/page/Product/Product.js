import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { getProduct } from '~/services/ProductsService';
import { addToCart, getUser } from '~/services/CartUtils';
import Notification from '~/components/Notification/Notification';

const cx = classNames.bind(styles);

function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [error, setError] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState({ title: '', body: '', typeMess: null });
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProduct(id);
                if (result) {
                    setProduct(result);
                    setSelectedColor(null);
                    setSelectedSize('');
                    const allSizes = result.colors.flatMap(color => color.sizes);
                    const uniqueSizes = [...new Set(allSizes.map(size => size.size))];
                    setAvailableSizes(uniqueSizes.map(size => ({ size, stock: 0 })));
                } else {
                    throw new Error('Invalid product data structure');
                }
            } catch (err) {
                setError('Failed to fetch product: ' + err.message);
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const updateAvailableSizes = (color) => {
        if (color) {
            setAvailableSizes(color.sizes);
        } else {
            // If no color is selected, show all sizes with combined stock
            const allSizes = product.colors.flatMap(c => c.sizes);
            const combinedSizes = allSizes.reduce((acc, curr) => {
                const existingSize = acc.find(s => s.size === curr.size);
                if (existingSize) {
                    existingSize.stock += curr.stock;
                } else {
                    acc.push({ ...curr });
                }
                return acc;
            }, []);
            setAvailableSizes(combinedSizes);
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color ? color.name : null);
        updateAvailableSizes(color);
        setSelectedSize(''); // Reset selected size when color changes
    };

    const handleQuantityChange = (change) => {
        if (!product) return;
        const newQty = Math.max(1, qty + change);
        let maxStock;

        if (selectedColor && selectedSize) {
            maxStock = availableSizes.find(size => size.size === selectedSize)?.stock || 0;
        } else {
            maxStock = getTotalStock();
        }

        setQty(Math.min(newQty, maxStock));
    };

    const handlePrice = (price) => price.toLocaleString();

    const handleAddToCart = async () => {
        const user = getUser();
        if (!user) {
            showNotificationMessage('Thất bại!', 'Bạn chưa đăng nhập', false);
            return;
        }

        if (!selectedColor || !selectedSize) {
            showNotificationMessage('Thất bại!', 'Vui lòng chọn màu sắc và kích thước', false);
            return;
        }

        if (product) {
            console.log(`product cart `, product,
                `color: ${selectedColor}`,
                `size: ${selectedSize}`);

            try {
                await addToCart(
                    product,
                    selectedColor,
                    selectedSize
                    , qty)
                showNotificationMessage('Thành công!', 'Sản phẩm đã được thêm vào giỏ hàng', true);
                setQty(1);
            } catch {
                showNotificationMessage('Thất bại!', 'Thêm sản phẩm thất bại', false);
            }
        }
    };

    const showNotificationMessage = (title, body, typeMess) => {
        setMessage({ title, body, typeMess });
        setShowNotification(true);
    };

    const handleDes = (description) => {
        return description
            .replace(/Size: S\/M\/L/, '<br />Size: S/M/L')
            .replace(/Hãy cân nhắc tham khảo size chart/, '<br />Hãy cân nhắc tham khảo size chart');
    };

    const getTotalStock = () => {
        return product.colors.reduce((total, color) => {
            return total + color.sizes.reduce((sum, size) => sum + size.stock, 0);
        }, 0);
    };


    const handleCheckout = () => {
        const user = getUser();
        if (!user) {
            showNotificationMessage('Thất bại!', 'Bạn chưa đăng nhập', false);
            return;
        }

        if (!selectedColor || !selectedSize) {
            showNotificationMessage('Thất bại!', 'Vui lòng chọn màu sắc và kích thước', false);
            return;
        }

        if (product) {
            const checkoutItem = {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                color: selectedColor,
                size: selectedSize,
                quantity: qty
            };

            navigate('/checkout', { state: { selectedItems: [checkoutItem], totalAmount: product.price * qty } });
        }
    };

    if (error) return <div className={cx('error')}>{error}</div>;
    if (!product) return <div className={cx('loading')}>Loading...</div>;

    return (
        <div className={cx('product-container')}>
            <Notification
                show={showNotification}
                message={message}
                onClose={() => setShowNotification(false)}
            />

            <div className={cx('product-image')}>
                <img src={product.image} alt={product.title} />
            </div>

            <div className={cx('product-details')}>
                <h2 className={cx('product-title')}>{product.title}</h2>
                <h3 className={cx('product-price')}>{`${handlePrice(product.price)} VND`}</h3>
                <div className={cx('product-options')}>
                    <div className={cx('option-group')}>
                        <h4>Màu sắc:</h4>
                        <div className={cx('color-selection')}>
                            {product.colors.map(color => (
                                <div key={color.name} className={cx('color-option')} style={{ opacity: color.sizes.some(size => size.stock > 0) ? 1 : 0.8 }}>
                                    <input
                                        type="radio"
                                        name="color"
                                        value={color.name}
                                        checked={selectedColor === color.name}
                                        onChange={() => handleColorChange(color)}
                                        disabled={!color.sizes.some(size => size.stock > 0)}
                                        id={`color-${color.name}`}
                                    />
                                    <label htmlFor={`color-${color.name}`}>{color.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cx('option-group')}>
                        <h4>Kích thước:</h4>
                        <div className={cx('size-selection')}>
                            {availableSizes.map(size => (
                                <div key={size.size} className={cx('size-option')} style={{ opacity: size.stock > 0 ? 1 : 0.8 }}>
                                    <input
                                        type="radio"
                                        name="size"
                                        value={size.size}
                                        checked={selectedSize === size.size}
                                        onChange={() => setSelectedSize(size.size)}
                                        disabled={size.stock === 0}
                                        id={`size-${size.size}`}
                                    />
                                    <label htmlFor={`size-${size.size}`}>{size.size}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cx('option-group')}>
                        <h4>Số lượng:</h4>
                        <div className={cx('quantity-selection')}>
                            <button onClick={() => handleQuantityChange(-1)} className={cx('quantity-btn')}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <input
                                min="1"
                                value={qty}
                                readOnly
                                className={cx('quantity-input')}
                            />
                            <button onClick={() => handleQuantityChange(1)} className={cx('quantity-btn')}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        <p className={cx('stock-info')}>
                            Kho: {getTotalStock()}
                        </p>
                    </div>
                </div>

                <div className={cx('action-buttons')}>
                    <button className={cx('add-to-cart')} onClick={handleAddToCart}>
                        Thêm vào giỏ hàng
                    </button>
                    <button className={cx('buy-now')} onClick={handleCheckout} >Thanh toán</button>
                </div>

                <div className={cx('product-description')}>
                    <h4>Mô tả sản phẩm</h4>
                    <p dangerouslySetInnerHTML={{ __html: handleDes(product.description) }} />
                </div>
            </div>
        </div>
    );
}

export default Product;