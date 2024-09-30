import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductsHome.module.scss';
import ProductItem from '../ProductItem/ProductItem';
import * as ProductsService from '~/services/ProductsService';
import CartPopup from '~/components/Cart/CartPopup';

const cx = classNames.bind(styles);

function HomeProducts() {
    const [products, setProducts] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await ProductsService.getProducts();
                setProducts(result?.slice(0, 12) || []); // Lấy 9 sản phẩm đầu tiên
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

    }, []);

    return (
        <div className={cx('home-products')}>
            <div className={cx("products-grid")}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductItem
                            className={cx('item')}
                            key={product.id}
                            data={product}

                        />
                    ))
                ) : (
                    <p>Loading products...</p>
                )}
            </div>
            {isCartOpen && (
                <CartPopup
                    onClose={toggleCart}
                />
            )}
        </div>
    );
}

export default HomeProducts;