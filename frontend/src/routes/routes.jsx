import Registration from "../pages/Registration/Registration.jsx";
import Login from "../pages/Login/Login.jsx";
import MainPage from "../pages/MainPage/MainPage.jsx";
import {PATHS} from './paths.js'
import CreateProduct from "@/pages/CreateProduct/CreateProduct.jsx";

const routes = [
    {
        path: PATHS.MAIN_PAGE,
        element: <MainPage />
    },
    {
        path: PATHS.REGISTER_PAGE,
        element: <Registration/>
    },
    {
        path: PATHS.LOGIN_PAGE,
        element: <Login/>
    },
    {
        path: PATHS.CREATE_PRODUCTS_PAGE,
        element: <CreateProduct/>
    }
];

export default routes;