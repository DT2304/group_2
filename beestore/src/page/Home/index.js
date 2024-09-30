import HomeProducts from "~/components/Products/ProductHome/ProductHome";
import styles from './home.module.scss'
import classNames from "classnames/bind";

const cx = classNames.bind(styles)

function Home() {
    return (
        <div>
            <h3 className={cx("title")}>Best Seller</h3>
            <HomeProducts />
        </div>
    );
}

export default Home;