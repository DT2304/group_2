import Home from "~/page/Home";
import config from "~/components/config/index";
import LogIn from "~/page/LogIn/login";
import Register from "~/page/Register/Register";
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.login, component: LogIn },
    { path: config.routes.register, component: Register },
];

export { publicRoutes }