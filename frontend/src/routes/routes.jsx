import Registration from "../pages/Registration/Registration.jsx";
import Login from "../pages/Login/Login.jsx";
import MainPage from "../pages/MainPage/MainPage.jsx";
import {PATHS} from './paths.js'

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
];

export default routes;