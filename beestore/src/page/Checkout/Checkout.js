import { useLocation } from 'react-router-dom';
import styles from './Checkout.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function Checkout() {
    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };

    const formattedAmount = (number) => {
        return new Intl.NumberFormat('vn-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(number)
    }

    return (
        <div className={cx('checkout-container')}>
            <div className={cx('selected-items')}>
                {selectedItems.map((item, index) => (
                    <div key={index} className={cx('checkout-item')}>
                        <img src={item.image} alt={item.title} className={cx('item-image')} />
                        <div className={cx('item-details')}>
                            <h3>{item.title}</h3>
                            <div className={cx('item-info')}>
                                <p>Màu: {item.color}</p>
                                <p>Size: {item.size}</p>
                            </div>
                            <p>Số Lượng:
                                <strong>
                                    {item.quantity}
                                </strong>
                            </p>
                            <p>Giá :
                                <strong>
                                    {formattedAmount(item.price)}
                                </strong>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cx('place-order-container')}>
                <div className={cx('total-amount')}>
                    <h2>Tổng tiền: {formattedAmount(totalAmount)}</h2>
                </div>
                <button className={cx('place-order-button')}>Thanh Toán</button>
            </div>
        </div>
    );
}

export default Checkout;