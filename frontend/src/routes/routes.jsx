import Registration from "../pages/Registration/Registration";
import Login from "../pages/Login/Login";
import {PATHS} from './paths.js'

const routes = [
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