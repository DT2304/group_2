import classNames from 'classnames/bind'
import styles from './ProductItem.module.scss'
import { Link } from 'react-router-dom'
import config from '~/config'

const cx = classNames.bind(styles)

function ProductItem({ data }) {

    const handlePrice = (price) => {
        return price.toLocaleString()

    }

    return (
        <div className={cx('card')}>
            <Link to={`${config.routes.productById.replace(':id', data.id)}`}>
                <div className={cx("img_product")}>
                    <img src={data.image} alt={data.title} />
                </div>
                <div className={cx("infor_product")}>
                    <p className={cx('title')}>{data.title}</p>
                    <p className={cx('price')}>{`${handlePrice(data.price)} VND`}</p>
                </div>
            </Link>
        </div>
    );
}

export default ProductItem;
