import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Products.module.scss';
import ProductItem from './ProductItem/ProductItem';
import * as ProductsService from '~/services/ProductsService';
import CartPopup from '../Cart/CartPopup';
import Pagination from '../Pagination/Pagination';

const cx = classNames.bind(styles);

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await ProductsService.getProducts();
                setProducts(result || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

    }, []);

    // Tính toán sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);



    // Thay đổi trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={cx('products-page')}>
            <div className={cx('filter')}>
                Filter content goes here
            </div>
            <div className={cx('products-container')}>
                <div className={cx("products-grid")}>
                    {currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <ProductItem
                                key={product.id}
                                data={product}
                            />
                        ))
                    ) : (
                        <p>Loading products...</p>
                    )}
                </div>
                <Pagination
                    productsPerPage={productsPerPage}
                    totalProducts={products.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
            {isCartOpen && (
                <CartPopup
                    onClose={toggleCart}
                />
            )}
        </div>
    );
}

export default ProductsPage;