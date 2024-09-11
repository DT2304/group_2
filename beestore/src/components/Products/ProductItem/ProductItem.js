import classNames from 'classnames/bind'
import styles from './ProductItem.module.scss'

const cx = classNames.bind(styles)

function ProductItem({ data, addToCart }) {
    return (
        <div className={cx('card')}>
            <div className={cx("img_product")}>
                <img src={data.image} alt={data.title} />
            </div>
            <div className={cx("infor_product")}>
                <p>{data.title}</p>
                <p>{`${data.price}$`}</p>
                <button onClick={() => addToCart(data)}>Thêm vào giỏ hàng</button>
            </div>
        </div>
    );
}   

export default ProductItem;
