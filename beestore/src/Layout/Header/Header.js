
import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import '~/components/GlobalStyle/GlobalStyle.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import config from '~/components/config';
import { useState } from 'react';
import CartPopup from '~/components/Cart/CartPopup';


const cx = classNames.bind(styles)

function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    return (
        <div className={cx('header')}>
            <div className={cx("header_title")}>
                <div className={cx('title')}>

                    <Link to={config.routes.home} > <h1>BEESTORE</h1> </Link>
                </div>
                <div className={cx('icons')}>
                    <Link to={config.routes.login}><div className={cx('icon_user')}><FontAwesomeIcon icon={faUser} /></div></Link>
                    <div className={cx('icon_search')}><FontAwesomeIcon icon={faSearch} /></div>
                    <div className={cx('icon_cart')} onClick={toggleCart}>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                    {isCartOpen && <CartPopup />}
                </div>
            </div>
            <div className={cx('infor')}>
                <div className={cx('home')}>
                    <Link to={config.routes.home} > <h4> Trang chủ</h4></Link>

                </div>
                <div className={cx('product')}>
                    <Link to='/product'><h4> Sản phẩm </h4></Link>

                </div>
                <div className={cx('contact')}>
                    <Link to='/contact'><h4> Liên hệ</h4></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;