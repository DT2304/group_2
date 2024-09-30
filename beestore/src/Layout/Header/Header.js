import classNames from 'classnames/bind'
import styles from './Header.module.scss'
import '~/components/GlobalStyle/GlobalStyle.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import config from '~/config';
import { useEffect, useRef, useState } from 'react';
import CartPopup from '~/components/Cart/CartPopup';
import { getUser } from '~/services/CartUtils';
import Notification from '~/components/Notification/Notification';

const cx = classNames.bind(styles);

function Header() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState({ title: '', body: '', typeMess: null });

    const cartRef = useRef(null);
    const cartIconRef = useRef(null);
    const userPopupRef = useRef(null);
    const userIconRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const user = getUser();
        if (user) {
            setUsername(user);
        }
    }, [username]);

    const handleCloseNotification = () => {
        setShowNotification(false);
    };

    const toggleCart = (event) => {
        event.stopPropagation(); // Prevent event from bubbling up
        if (!username) {
            setMessage({
                title: 'Thất bại',
                body: 'Bạn chưa đăng nhập',
                typeMess: false
            })
            setShowNotification(true)
            return;
        }
        setIsCartOpen(prevState => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUsername('');
        setIsUserPopupOpen(false);
    };

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current);
        setIsUserPopupOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsUserPopupOpen(false);
        }, 700);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isCartOpen && cartRef.current && !cartRef.current.contains(event.target) && !cartIconRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCartOpen]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div className={cx('header')}>
            <Notification show={showNotification} message={message} onClose={handleCloseNotification} />
            <div className={cx("header_title")}>
                <div className={cx('title')}>
                    <Link to={config.routes.home}><h1>BEESTORE</h1></Link>
                </div>
                <div className={cx('icons')}>
                    <div
                        ref={userIconRef}
                        className={cx('icon_user')}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        {isUserPopupOpen && (
                            <div
                                ref={userPopupRef}
                                className={cx('user-popup')}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {username ? (
                                    <>
                                        <div>{username}</div>
                                        <div onClick={handleLogout}>Đăng xuất</div>
                                    </>
                                ) : (
                                    <>
                                        <Link to={config.routes.login}>
                                            <div>Đăng nhập</div>
                                        </Link>
                                        <Link to={config.routes.register}>
                                            <div>Đăng ký</div>
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={cx('icon_search')}>
                        <Link to={config.routes.Search}><FontAwesomeIcon icon={faSearch} /></Link>
                    </div>
                    <div ref={cartIconRef} className={cx('icon_cart')} onClick={toggleCart}>
                        <FontAwesomeIcon icon={faCartShopping} />
                    </div>
                    {isCartOpen && (
                        <div ref={cartRef}>
                            <CartPopup />
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('infor')}>
                <div className={cx('home')}>
                    <Link to={config.routes.home}><h4> Trang chủ</h4></Link>
                </div>
                <div className={cx('product')}>
                    <Link to='/products'><h4> Sản phẩm </h4></Link>
                </div>
                <div className={cx('contact')}>
                    <Link to='/contact'><h4> Liên hệ</h4></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;