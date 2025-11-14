import React from 'react';
import styles from './Layout.module.scss';
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import {Outlet, useLocation} from 'react-router';
import ProductsGrid from "@/components/ProductsGrid/ProductsGrid.jsx";

const Layout = () => {
    const location = useLocation();

    return (
        <div className={styles.wrapper}>
            <Header/>
            <main className={styles.main}>
                {location.pathname === '/' && <ProductsGrid />}
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;