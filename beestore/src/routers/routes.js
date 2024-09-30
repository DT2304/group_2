import Home from "~/page/Home";
import config from "~/config/index";
import LogIn from "~/page/LogIn/login";
import Register from "~/page/Register/Register";
import Product from "~/page/Product/Product";
import Products from "~/page/Products/Products";
import Search from "~/page/Search/Search";
import Cart from "~/page/Cart/Cart";
import Checkout from "~/page/Checkout/Checkout";
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: LogIn },
    { path: config.routes.register, component: Register },
    { path: config.routes.productById, component: Product },
    { path: config.routes.Products, component: Products },
    { path: config.routes.Search, component: Search },
    { path: config.routes.Cart, component: Cart },
    { path: config.routes.checkout, component: Checkout },
];

export { publicRoutes }