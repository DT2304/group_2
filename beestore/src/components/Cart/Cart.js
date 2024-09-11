import React from 'react';
import classNames from "classnames/bind";
import styles from './Cart.module.scss'

const cx = classNames.bind(styles)

function Cart({ items, updateQuantity, removeItem }) {
    return (
        <div className={cx("cart")}>
            <h2>Giỏ hàng</h2>
            {items && items.length > 0 ? (
                items.map((item) => (
                    <div key={item.id} className={cx("item")}>
                        <p>{item.title} - ${item.price}</p>
                        <input 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                        <button onClick={() => removeItem(item.id)}>Xóa</button>
                    </div>
                ))
            ) : (
                <h4>Giỏ hàng trống</h4>
            )}
        </div>
    );
}

export default Cart;