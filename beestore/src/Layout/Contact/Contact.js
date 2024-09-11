import classNames from "classnames/bind";
import styles from './Contact.module.scss';
import '~/components/GlobalStyle/GlobalStyle.module.scss';
import { Facebook, Instagram } from "~/components/Icons/Icons";
const cx = classNames.bind(styles);

function Contact() {
    return (
        <div>
            <div className={cx("wrapper")}>
                <div className={cx("intro")}>

                    <h2>GIỚI THIỆU</h2>
                    <h4>BEESTORE ESSENCE</h4>
                    <div className={cx("brand")}>
                        <img
                            src="https://levents.asia/cdn/shop/files/Va_no_la.png?v=1700562522&width=500"
                            alt="Beestore Essence"
                        />
                    </div>
                </div>
                <div className={cx("infor")}>
                    <h2>THÔNG TIN LIÊN HỆ</h2>
                    <h4>Địa chỉ : 374 Tôn đản , Thành phố Đà Nẵng</h4>
                    <h4>Điện thoại: ######### </h4>
                    <h4>Mail: hoang2h23.nvh@gmail.com</h4>
                </div>
                <div className={cx("follow")}>
                    <h2>THEO DÕI CHÚNG TÔI
                    </h2>
                    <a href="https://www.facebook.com/dt2301">
                        <p>
                            <Facebook className={cx("icon")} />
                            FACEBOOK
                        </p>
                    </a>
                    <a href="https://www.instagram.com/hoang_sv/">
                        <p>
                            <Instagram className={cx("icon")} />
                            INSTAGRAM
                        </p>
                    </a>
                </div>

            </div>
            <p className={cx('Copyright')}>Copyright © 2022 BEESTORE. Powered by Haravan</p>
        </div>
    );
}

export default Contact;
