import Registration from "../pages/Registration/Registration.jsx";
import Login from "../pages/Login/Login.jsx";
import {PATHS} from './paths.js'
import CreateProduct from "@/pages/CreateProduct/CreateProduct.jsx";
import Layout from "@/components/Layout/Layout.jsx";
import EditProduct from "@/pages/EditProduct/EditProduct.jsx";
import Profile from "@/pages/Profile/Profile.jsx";
import ContactPage from '@/pages/ContactPage/ContactPage.jsx';
import CheckoutPage from "@/pages/CheckoutPage/CheckoutPage.jsx";

const routes = [{
    path: PATHS.MAIN_PAGE, element: <Layout/>, children: [
        {path: PATHS.CREATE_PRODUCTS_PAGE, element: <CreateProduct/>},
        {path: PATHS.EDIT_PRODUCTS_PAGE, element: <EditProduct/>},
        {path: PATHS.PROFILE_PAGE, element: <Profile/>},
        {path: PATHS.CONTACT_PAGE, element: <ContactPage/>},
        {path: PATHS.CHECKOUT_PAGE, element: <CheckoutPage/>},
    ]
}, {
    path: PATHS.REGISTER_PAGE, element: <Registration/>
}, {
    path: PATHS.LOGIN_PAGE, element: <Login/>
},];

export default routes;