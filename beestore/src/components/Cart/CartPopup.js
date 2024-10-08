import React from 'react';
import classNames from 'classnames/bind';
import styles from './CartPopup.module.scss';
import Cart from './Cart';


const cx = classNames.bind(styles);

function CartPopup({ items}) {
    return (
        <div className={cx('cart-popup')}>
            <Cart
                items={items}

            />
        </div>
    );
}

export default CartPopup;